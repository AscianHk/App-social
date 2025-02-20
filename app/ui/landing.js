export default () => {
    return (
            <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-pink-100 to-blue-200">
                <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4 w-96 border border-gray-200">
                <h1 className="text-3xl text-center font-semibold text-gray-700">Welcome to AppSocial</h1>
                <p className="text-gray-500">Please log in to continue</p>
                <a
                    href="/auth/login"
                    className="mt-4 bg-pink-400 hover:bg-pink-500 transition-all duration-300 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
                >
                    Log in
                </a>
                </div>
            </div>
    )
}