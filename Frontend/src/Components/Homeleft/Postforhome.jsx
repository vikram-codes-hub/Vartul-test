import React from 'react'
import Posthelper from './Posthelper/Posthelper'
import { dummyPosts } from '../../assets/Storydummydata'

const Postforhome = () => {
  return (
    <div className="py-3 sm:py-6 space-y-3 sm:space-y-8 px-2 sm:px-4 mx-auto w-full max-w-[95%] sm:max-w-[85%] md:max-w-[70%] overflow-x-hidden">
      {dummyPosts.map((post) => (
        <div key={post.id} className="transform scale-[0.95] sm:scale-100">
          <Posthelper 
            profile={post.profile}
            username={post.username}
            postImage={post.postImage}
            likes={post.likes}
            caption={post.caption}
          />
        </div>
      ))}
    </div>
  )
}

export default Postforhome