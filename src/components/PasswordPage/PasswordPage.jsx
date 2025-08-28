'use client'
import React from 'react'
import Image from 'next/image'
import { HEADER_CONTENT } from '@/data/header'
import Spinner from '../Spinner'

export default function PasswordPage({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [passwordInput, setPasswordInput] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [serverPassword, setServerPassword] = React.useState('')

  // 1. Fetch the current password from your backend (e.g., GitHub API)
  React.useEffect(() => {
    async function fetchPassword() {
      const res = await fetch(
        'https://raw.githubusercontent.com/aroan-v/nylon-biggest-breakout-star-cache/refs/heads/main/password.json'
      ) // replace with your real endpoint
      const data = await res.json()
      setServerPassword(data.password)

      console.log('data', data)

      // 2. Check if user already has valid auth in localStorage
      const storedPassword = localStorage.getItem('auth_password')
      if (storedPassword && storedPassword === data.password) {
        setIsAuthenticated(true)
      }
      setLoading(false)
    }
    fetchPassword()
  }, [])

  // 3. Handle login
  const handleLogin = () => {
    if (passwordInput === serverPassword) {
      localStorage.setItem('auth_password', passwordInput) // persist login
      setIsAuthenticated(true)
    } else {
      alert('Wrong password!')
    }
  }

  if (loading)
    return (
      <div className="p-4">
        <Spinner />
      </div>
    )

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-5">
        <div className="mx-auto w-[300px]">
          <Image
            src="/nylon-logo.svg" // from /public folder
            alt="Nylon Logo"
            width={3443}
            height={590}
          />
        </div>

        <h1 className="text-color-foreground text-center text-xl leading-tight font-extrabold sm:text-2xl">
          {HEADER_CONTENT.title}
        </h1>
        <div className="w-80 rounded-lg bg-gray-800 p-6 shadow-lg shadow-black/40">
          <h2 className="mb-4 text-xl font-bold text-gray-100">Enter Password</h2>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="mb-4 w-full rounded border border-gray-700 bg-gray-900 p-2 text-gray-100 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring focus:ring-blue-500/30"
            placeholder="Password"
          />
          <button
            onClick={handleLogin}
            className="w-full rounded bg-blue-600 p-2 text-white transition hover:bg-blue-500"
          >
            Submit
          </button>
        </div>
      </div>
    )
  }

  // 4. Render your protected content
  return <>{children}</>
}
