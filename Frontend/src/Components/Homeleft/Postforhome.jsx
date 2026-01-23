import React from 'react'
import Posthelper from './Posthelper/Posthelper'
import { dummyPosts } from '../../assets/Storydummydata'

const Postforhome = () => {
  return (
    <div className="w-full space-y-4">
      {dummyPosts.map((post) => (
        <Posthelper 
          key={post.id}
          profile={post.profile}
          username={post.username}
          postImage={post.postImage}
          likes={post.likes}
          caption={post.caption}
        />
      ))}
      
      {/* End of posts message */}
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-semibold mb-1">You're all caught up</p>
        <p className="text-xs">You've seen all new posts from the past 3 days.</p>
      </div>
    </div>
  )
}

export default Postforhome