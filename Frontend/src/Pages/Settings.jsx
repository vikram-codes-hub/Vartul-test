import React, { useState } from 'react'
import { IoChevronForward, IoPersonOutline, IoNotificationsOutline, IoLockClosedOutline, IoEyeOutline, IoHeartOutline, IoShieldCheckmarkOutline, IoHelpCircleOutline, IoInformationCircleOutline } from 'react-icons/io5'
import { MdLanguage, MdDarkMode } from 'react-icons/md'
import { BsGlobe } from 'react-icons/bs'

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [privateAccount, setPrivateAccount] = useState(false)

  const settingsData = [
    {
      title: 'Account',
      icon: <IoPersonOutline className='w-6 h-6' />,
      items: [
        { label: 'Edit Profile', path: '/edit-profile' },
        { label: 'Change Password', path: '/change-password' },
        { label: 'Posts You\'ve Liked', path: '/liked-posts' },
        { label: 'Saved', path: '/saved' },
        { label: 'Close Friends', path: '/close-friends' },
        { label: 'Language', path: '/language' }
      ]
    },
    {
      title: 'Privacy',
      icon: <IoLockClosedOutline className='w-6 h-6' />,
      items: [
        { label: 'Account Privacy', path: '/privacy', toggle: true, value: privateAccount, onChange: setPrivateAccount },
        { label: 'Activity Status', path: '/activity-status' },
        { label: 'Story', path: '/story-settings' },
        { label: 'Posts', path: '/post-settings' },
        { label: 'Blocked Accounts', path: '/blocked' },
        { label: 'Hide Story and Live', path: '/hide-story' }
      ]
    },
    {
      title: 'Notifications',
      icon: <IoNotificationsOutline className='w-6 h-6' />,
      items: [
        { label: 'Push Notifications', path: '/notifications', toggle: true, value: notifications, onChange: setNotifications },
        { label: 'Email Notifications', path: '/email-notifications' },
        { label: 'SMS Notifications', path: '/sms-notifications' }
      ]
    },
    {
      title: 'Security',
      icon: <IoShieldCheckmarkOutline className='w-6 h-6' />,
      items: [
        { label: 'Two-Factor Authentication', path: '/2fa' },
        { label: 'Login Activity', path: '/login-activity' },
        { label: 'Security Checkup', path: '/security-checkup' }
      ]
    },
    {
      title: 'Help',
      icon: <IoHelpCircleOutline className='w-6 h-6' />,
      items: [
        { label: 'Help Center', path: '/help' },
        { label: 'Report a Problem', path: '/report' },
        { label: 'Support Requests', path: '/support' }
      ]
    },
    {
      title: 'About',
      icon: <IoInformationCircleOutline className='w-6 h-6' />,
      items: [
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy-policy' },
        { label: 'Community Guidelines', path: '/guidelines' }
      ]
    }
  ]

  return (
    <div className='min-h-screen bg-black text-white ml-64'>
      {/* Header */}
      <div className='border-b border-gray-800 px-8 py-6'>
        <h1 className='text-2xl font-semibold'>Settings</h1>
      </div>

      {/* Settings Content */}
      <div className='max-w-4xl mx-auto px-8 py-6'>
        {/* Theme Toggle */}
        <div className='mb-8 p-6 bg-gray-900 rounded-xl border border-gray-800'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <MdDarkMode className='w-6 h-6 text-blue-500' />
              <div>
                <h3 className='font-semibold text-lg'>Dark Mode</h3>
                <p className='text-sm text-gray-400'>Switch between light and dark themes</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                darkMode ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        {settingsData.map((section, idx) => (
          <div key={idx} className='mb-8'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='text-gray-400'>{section.icon}</div>
              <h2 className='text-xl font-semibold'>{section.title}</h2>
            </div>
            
            <div className='bg-gray-900 rounded-xl border border-gray-800 overflow-hidden'>
              {section.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className='px-6 py-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-800 transition-colors cursor-pointer'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <p className='text-base'>{item.label}</p>
                    </div>
                    
                    {item.toggle ? (
                      <button
                        onClick={() => item.onChange(!item.value)}
                        className={`relative w-12 h-7 rounded-full transition-colors ${
                          item.value ? 'bg-blue-500' : 'bg-gray-700'
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            item.value ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    ) : (
                      <IoChevronForward className='w-5 h-5 text-gray-400' />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className='mt-8'>
          <button className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition-colors'>
            Log Out
          </button>
        </div>

        {/* Account Actions */}
        <div className='mt-4 flex gap-4'>
          <button className='flex-1 bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold py-4 rounded-xl transition-colors border border-gray-800'>
            Switch Account
          </button>
          <button className='flex-1 bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold py-4 rounded-xl transition-colors border border-gray-800'>
            Add Account
          </button>
        </div>

        {/* Footer Info */}
        <div className='mt-12 text-center text-gray-500 text-sm pb-8'>
          <p>© 2025 Instagram Clone</p>
          <p className='mt-2'>Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

export default Settings