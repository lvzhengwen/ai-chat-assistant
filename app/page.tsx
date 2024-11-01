import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            与AI对话，探索无限可能
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            基于先进的人工智能技术，为您提供智能、自然、流畅的对话体验
          </p>
          <div className="mt-10">
            <Link 
              href="/chat"
              className="rounded-full bg-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              开始对话
            </Link>
          </div>
        </div>

        {/* 特性展示 */}
        <div className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-lg bg-indigo-100 p-4 w-12 h-12 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">自然对话</h3>
            <p className="mt-2 text-gray-600">流畅的对话体验，就像与真人交谈一样自然</p>
          </div>

          <div className="relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-lg bg-indigo-100 p-4 w-12 h-12 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">即时响应</h3>
            <p className="mt-2 text-gray-600">快速准确的回答，让您的问题得到及时解决</p>
          </div>

          <div className="relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-lg bg-indigo-100 p-4 w-12 h-12 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">个性化定制</h3>
            <p className="mt-2 text-gray-600">根据您的需求提供量身定制的对话体验</p>
          </div>
        </div>
      </div>
    </main>
  )
}
