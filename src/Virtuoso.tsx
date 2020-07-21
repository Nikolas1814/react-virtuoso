import React, { CSSProperties, FC, forwardRef, ReactElement, useImperativeHandle, useEffect, useState } from 'react'
import { TScrollLocation } from './EngineCommons'
import { ListRange, ScrollSeekConfiguration } from './engines/scrollSeekEngine'
import { ListItem } from './GroupIndexTransposer'
import { TSubscriber } from './tinyrx'
import { VirtuosoContext } from './VirtuosoContext'
import { TRenderProps } from './VirtuosoList'
import { VirtuosoStore } from './VirtuosoStore'
import { DefaultListContainer, TFooterContainer, TListContainer, TScrollContainer, VirtuosoView } from './VirtuosoView'

export type VirtuosoState = ReturnType<typeof VirtuosoStore>

export type TItemContainer = React.FC<Omit<TRenderProps, 'renderPlaceholder' | 'scrollVelocity'>>

export interface VirtuosoProps {
  totalCount: number
  overscan?: number
  topItems?: number
  footer?: () => ReactElement
  item: (index: number) => ReactElement
  computeItemKey?: (index: number) => React.Key
  prependItemCount?: number
  itemHeight?: number
  defaultItemHeight?: number
  endReached?: (index: number) => void
  scrollingStateChange?: TSubscriber<boolean>
  atBottomStateChange?: TSubscriber<boolean>
  itemsRendered?: TSubscriber<ListItem[]>
  rangeChanged?: TSubscriber<ListRange>
  totalListHeightChanged?: TSubscriber<number>
  style?: CSSProperties
  dataKey?: string
  className?: string
  initialItemCount?: number
  initialTopMostItemIndex?: number
  followOutput?: boolean
  ScrollContainer?: TScrollContainer
  FooterContainer?: TFooterContainer
  ListContainer?: TListContainer
  ItemContainer?: TItemContainer
  maxHeightCacheSize?: number
  scrollSeek?: ScrollSeekConfiguration
}

export interface TVirtuosoPresentationProps {
  contextValue: VirtuosoState
  footer?: () => ReactElement
  style?: CSSProperties
  className?: string
  itemHeight?: number
  ScrollContainer?: TScrollContainer
  FooterContainer?: TFooterContainer
  ListContainer?: TListContainer
}

export { TScrollContainer, TListContainer }

const DEFAULT_STYLE = {}
export const VirtuosoPresentation: FC<TVirtuosoPresentationProps> = React.memo(
  ({ contextValue, style, className, footer, itemHeight, ScrollContainer, ListContainer, FooterContainer }) => {
    return (
      <VirtuosoContext.Provider value={contextValue}>
        <VirtuosoView
          style={style || DEFAULT_STYLE}
          className={className}
          footer={footer}
          fixedItemHeight={itemHeight !== undefined}
          ScrollContainer={ScrollContainer}
          FooterContainer={FooterContainer}
          ListContainer={ListContainer || DefaultListContainer}
        />
      </VirtuosoContext.Provider>
    )
  }
)

export interface VirtuosoMethods {
  scrollToIndex(location: TScrollLocation): void
  adjustForPrependedItems(count: number): void
  remainScrollPosition(currentTopIndex: number, newElementsCount: number): void
  prependItems(newItemsCount: number, oldTopIndex: number): void
  appendItems(newItemsCount: number): void
}

export const Virtuoso = forwardRef<VirtuosoMethods, VirtuosoProps>((props, ref) => {
  const [state] = useState(() => VirtuosoStore(props))
  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (location: TScrollLocation) => {
        state.scrollToIndex(location)
      },
      adjustForPrependedItems: (count: number) => {
        state.adjustForPrependedItems(count)
      },
      remainScrollPosition: (currentTopIndex: number, newElementsCount: number) => {
        window.requestAnimationFrame(() => {
          state.scrollToIndex({
            index: currentTopIndex + newElementsCount,
            align: 'start',
          })
        })
      },
      prependItems: (newElementsCount: number) => {
        return new Promise((resolve: any, reject: any) => {
          window.requestAnimationFrame(() => {
            if (!state.currentTotal.val) return reject()
            const current = state.currentTotal.val || 0
            //console.log('start total', state.currentTotal.val, current)
            state.totalCount(current + newElementsCount)
            //console.log('start index', state.currentRange.startIndex)
            state.scrollToIndex({
              index: state.currentRange.startIndex + newElementsCount,
              align: 'start',
            })
            resolve()
          })
        })
      },
      appendItems: (newElementsCount: number) => {
        return new Promise((resolve: any, reject: any) => {
          if (!state.currentTotal.val) return reject()
          const current = state.currentTotal.val || 0
          state.totalCount(current + newElementsCount)
          resolve()
        })
      },
    }),
    [state]
  )

  useEffect(() => {
    state.isScrolling(props.scrollingStateChange)
    state.atBottomStateChange(props.atBottomStateChange)
    state.endReached(props.endReached)
    state.topItemCount(props.topItems || 0)
    props.initialItemCount && state.initialItemCount(props.initialItemCount)
    state.itemsRendered(props.itemsRendered)
    state.totalListHeightChanged(props.totalListHeightChanged)
    state.followOutput(!!props.followOutput)
    state.maxRangeSize(props.maxHeightCacheSize || Infinity)
    state.rangeChanged(props.rangeChanged)
    state.scrollSeekConfiguration(props.scrollSeek)
    state.computeItemKey(props.computeItemKey || (key => key))
    state.itemContainer(props.ItemContainer || 'div')
    state.renderProp(props.item)
    state.dataKey(props.dataKey)

    return () => {
      state.itemsRendered(undefined)
      state.totalListHeightChanged(undefined)
    }
  }, [
    state,
    props.scrollingStateChange,
    props.atBottomStateChange,
    props.endReached,
    props.topItems,
    //props.totalCount,
    props.initialItemCount,
    props.itemsRendered,
    props.totalListHeightChanged,
    props.followOutput,
    props.maxHeightCacheSize,
    props.rangeChanged,
    props.scrollSeek,
    props.item,
    props.ItemContainer,
    props.computeItemKey,
    props.dataKey,
  ])
  useEffect(() => {
    state.totalCount(props.totalCount)
  }, [])

  return (
    <VirtuosoPresentation
      contextValue={state}
      style={props.style}
      className={props.className}
      footer={props.footer}
      itemHeight={props.itemHeight}
      ScrollContainer={props.ScrollContainer}
      FooterContainer={props.FooterContainer}
      ListContainer={props.ListContainer}
    />
  )
})

Virtuoso.displayName = 'Virtuoso'
