import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-yellow-50">
      <div className="flex flex-col md:flex-row w-full h-full min-h-screen">
        {/* Left side with image and logo, hidden on small screens */}
        <div className="flex-1 flex-col items-center justify-center bg-blue-100 relative hidden md:flex">
          <div className="absolute top-8 left-8">
            <Image src="/logo.png" alt="Finance Logo" width={128} height={128} />
          </div>
          <div className="relative w-[320px] h-[220px] md:w-[500px] md:h-[340px]">
            <Image
              src="/laptop.png"
              alt="Finance Management Laptop Preview"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
        {/* Right side with text */}
        <div className="flex-1 flex flex-col justify-center items-start px-8 md:px-20 py-16 bg-white w-full">
          {/* Show logo at top on small screens */}
          <div className="flex items-center mb-8 md:hidden">
            <Image
              src="/logo.png"
              alt="Finance Logo"
              width={48}
              height={48}
              className="mr-3"
            />
            <span className="text-orange-500 font-bold text-2xl">Finance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Empowering <span className="text-blue-700">Finance Companies</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-xl">
            Welcome to Finance, the modern platform designed specifically for
            finance companies to streamline operations, manage client portfolios,
            and deliver exceptional financial services. Our solution helps your
            team track investments, monitor transactions, and provide real-time
            analytics—all in one secure, easy-to-use dashboard.
          </p>
          <ul className="space-y-3 mb-10">
            <li className="flex items-center text-base text-gray-700">
              <span className="text-orange-500 mr-2">✔</span>{" "}
              Centralized client and account management
            </li>
            <li className="flex items-center text-base text-gray-700">
              <span className="text-orange-500 mr-2">✔</span>{" "}
              Real-time portfolio tracking and reporting
            </li>
            <li className="flex items-center text-base text-gray-700">
              <span className="text-orange-500 mr-2">✔</span>{" "}
              Secure, compliant, and scalable infrastructure
            </li>
            <li className="flex items-center text-base text-gray-700">
              <span className="text-orange-500 mr-2">✔</span>{" "}
              Customizable dashboards for your business needs
            </li>
          </ul>
          <a
            href="/dashboard"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors text-lg"
          >
            Sign Up
          </a>
          <a
            href="/dashboard/transaction"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors text-lg"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
