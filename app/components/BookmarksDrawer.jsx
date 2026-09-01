'use client'

import { useState, useEffect } from 'react'

export default function BookmarksDrawer({ isOpen, onClose, onSelectBookmark, bookmarks, onDeleteBookmark }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-bg border border-white/10 rounded-lg p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-base text-white">🔖</span>
            <h2 className="text-xs uppercase tracking-[0.3em] text-white font-medium">
              Saved Bookmarks ({bookmarks.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-white transition-colors text-sm px-2 py-1"
            aria-label="Close Bookmarks"
          >
            ✕
          </button>
        </div>

        {/* Bookmarks List */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="text-2xl text-secondary/40">🔖</div>
              <p className="text-sm font-serif italic text-secondary">No bookmarks saved yet.</p>
              <p className="text-xs text-secondary/50 max-w-xs mx-auto leading-relaxed">
                Click the bookmark icon while reading any manuscript to save your exact reading position.
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                onClick={() => {
                  onSelectBookmark(bm)
                  onClose()
                }}
                className="group border border-white/5 hover:border-white/20 rounded-md p-5 bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer transition-all duration-300 flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[8px] tracking-[0.2em] font-mono text-secondary uppercase">
                      {bm.chapterLabel || 'Chapter'} {bm.scrollPercent ? `· ${bm.scrollPercent}% read` : ''}
                    </span>
                    <h3 className="text-lg font-serif italic text-white group-hover:translate-x-1 transition-transform">
                      {bm.chapterTitle || 'Untitled Section'}
                    </h3>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-secondary/70 mt-0.5">
                      {bm.bookTitle}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteBookmark(bm.id)
                    }}
                    className="text-secondary/40 hover:text-red-400 text-xs p-1.5 transition-colors"
                    title="Delete Bookmark"
                  >
                    ✕
                  </button>
                </div>

                {bm.quoteSnippet && (
                  <p className="text-xs font-light text-secondary/70 italic border-l border-white/10 pl-3 line-clamp-2 my-1">
                    "{bm.quoteSnippet}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[8px] tracking-[0.2em] uppercase font-mono text-secondary/60">
                  <span>{bm.dateFormatted || 'Saved'}</span>
                  <span className="text-white group-hover:translate-x-1 transition-transform flex items-center gap-1 font-sans text-[9px] tracking-[0.2em]">
                    Resume Reading →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {bookmarks.length > 0 && (
          <div className="pt-4 mt-4 border-t border-white/5 text-center text-[8px] tracking-[0.2em] uppercase font-mono text-secondary/40">
            Click any card to resume from exact paragraph
          </div>
        )}
      </div>
    </div>
  )
}
