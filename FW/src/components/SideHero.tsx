import { BookOpen, FileText, Search } from "lucide-react"


const SideHero = () => {
  return (
    <div className="mt-12 lg:m-0 lg:relative">
    <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
      <div className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none">
        <div className="relative h-64 w-full sm:h-72 md:h-96 lg:h-full lg:w-full bg-indigo-100 rounded-xl p-6 flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute top-0 -left-4 w-36 h-36 bg-indigo-300 rounded-full opacity-50"></div>
            <div className="absolute top-0 -right-4 w-36 h-36 bg-purple-300 rounded-full opacity-50"></div>
            <div className="absolute -bottom-8 left-20 w-36 h-36 bg-pink-300 rounded-full opacity-50"></div>
            <div className="relative space-y-4">
              <div className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8 shadow-md">
                <div className="flex-1">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="mt-2 h-3 w-32 bg-gray-200 rounded"></div>
                </div>
                <BookOpen className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8 shadow-md">
                <div className="flex-1">
                  <div className="h-4 w-56 bg-gray-200 rounded"></div>
                  <div className="mt-2 h-3 w-40 bg-gray-200 rounded"></div>
                </div>
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <div className="p-5 bg-white rounded-lg flex items-center justify-between space-x-8 shadow-md">
                <div className="flex-1">
                  <div className="h-4 w-44 bg-gray-200 rounded"></div>
                  <div className="mt-2 h-3 w-36 bg-gray-200 rounded"></div>
                </div>
                <Search className="h-6 w-6 text-pink-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  )
}

export default SideHero