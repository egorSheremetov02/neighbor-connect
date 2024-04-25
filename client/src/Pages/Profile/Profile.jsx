import React from "react";

export default function Profile() {
  return (
    <div>
      <style>
        {`
          :root {
            --main-color: #4a76a8;
          }

          .bg-main-color {
            background-color: var(--main-color);
          }

          .text-main-color {
            color: var(--main-color);
          }

          .border-main-color {
            border-color: var(--main-color);
          }
        `}
      </style>
      <link
        href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <script
        src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js"
        defer
      ></script>

      <div className="bg-gray-100">
        {/* The of Navbar place */}

        <div className="container mx-auto my-5 p-5">
          <div className="md:flex no-wrap md:-mx-2 ">
            {/* Left Side */}
            <div className="w-full md:w-3/12 md:mx-2">
              {/* Profile Card */}
              <div className="bg-white p-3 border-t-4 border-blue-400">
                <div className="image overflow-hidden">
                  <img
                    className="h-auto w-full mx-auto"
                    src="https://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg"
                    alt=""
                  />
                </div>

                <img
                  className="inline h-20 rounded-full"
                  src="https://avatars2.githubusercontent.com/u/24622175?s=60&amp;v=4"
                  alt=""
                />

                <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                  Jane Doe
                </h1>
                <h3 className="text-gray-600 font-lg text-semibold leading-6">
                  Owner at Her Company Inc.
                </h3>
                <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Reprehenderit, eligendi dolorum sequi illum qui unde
                  aspernatur non deserunt
                </p>
                <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                  <li className="flex items-center py-3">
                    <span>Status</span>
                    <span className="ml-auto">
                      <span className="bg-blue-500 py-1 px-2 rounded text-white text-sm">
                        Active
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>Member since</span>
                    <span className="ml-auto">Nov 07, 2016</span>
                  </li>
                </ul>
              </div>
              {/* End of profile card */}
              <div className="my-4"></div>
              {/* Friends card */}
              <div className="bg-white p-3 hover:shadow">
                <div className="flex items-center space-x-3 font-semibold text-gray-900 text-xl leading-8">
                  <span className="text-blue-500">
                    <svg
                      className="h-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </span>
                  <span>Similar Profiles</span>
                </div>
                <div className="grid grid-cols-3">
                  <div className="text-center my-2">
                    <img
                      className="h-16 w-16 rounded-full mx-auto"
                      src="https://cdn.australianageingagenda.com.au/wp-content/uploads/2015/06/28085920/Phil-Beckett-2-e1435107243361.jpg"
                      alt=""
                    />
                    <a href="#" className="text-main-color">
                      Kojstantin
                    </a>
                  </div>
                  <div className="text-center my-2">
                    <img
                      className="h-16 w-16 rounded-full mx-auto"
                      src="https://avatars2.githubusercontent.com/u/24622175?s=60&amp;v=4"
                      alt=""
                    />
                    <a href="#" className="text-main-color">
                      James
                    </a>
                  </div>
                  <div className="text-center my-2">
                    <img
                      className="h-16 w-16 rounded-full mx-auto"
                      src="./public/images/profile-1.jpg"
                      alt=""
                    />
                    <a href="#" className="text-main-color">
                      Natie
                    </a>
                  </div>
                  <div className="text-center my-2">
                    <img
                      className="h-16 w-16 rounded-full mx-auto"
                      src="./public/images/profile-2.jpg"
                      alt=""
                    />
                    <a href="#" className="text-main-color">
                      Casey
                    </a>
                  </div>
                </div>
              </div>
              {/* End of friends card */}
            </div>
            {/* Right Side */}
            <div className="w-full md:w-9/12 mx-2 h-64">
              {/* Profile tab */}
              {/* About Section */}
              <div className="bg-white p-3 shadow-sm rounded-sm">
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                  <span className="text-blue-500">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">About</span>
                </div>
                <div className="text-gray-700">
                  <div className="grid md:grid-cols-2 text-sm">
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">First Name</div>
                      <div className="px-4 py-2">Jane</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Last Name</div>
                      <div className="px-4 py-2">Doe</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Gender</div>
                      <div className="px-4 py-2">Female</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Contact No.</div>
                      <div className="px-4 py-2">+11 998001001</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Current Address
                      </div>
                      <div className="px-4 py-2">Bremen, Germany</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">
                        Permanant Address
                      </div>
                      <div className="px-4 py-2">Bremen, Germany</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Email.</div>
                      <div className="px-4 py-2">
                        <a
                          className="text-blue-800"
                          href="mailto:jane@example.com"
                        >
                          jane@example.com
                        </a>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-4 py-2 font-semibold">Birthday</div>
                      <div className="px-4 py-2">Feb 06, 1998</div>
                    </div>
                  </div>
                </div>
                <button className="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
                  Show Full Information
                </button>
              </div>
              {/* End of about section */}
              <div className="my-4"></div>
              {/* Experience and education */}
              <div className="bg-white p-3 shadow-sm rounded-sm">
                <div className="grid grid-cols-2">
                  <div>
                    <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                      <span className="text-blue-500">
                        <svg
                          className="h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </span>
                      <span className="tracking-wide">Interests</span>
                    </div>
                    <div className="space-x-5 space-y-3 flex flex-wrap">
                      <div className="mt-3 ml-5">
                        <span className="bg-blue-500 px-4 rounded-md text-white py-[2px]">
                          sport
                        </span>
                      </div>

                      <div>
                        <span className="bg-yellow-500 px-4 rounded-md text-white py-[2px]">
                          Guitar palying
                        </span>
                      </div>

                      <div>
                        <span className="bg-gray-700 px-4 rounded-md text-white py-[2px]">
                          Swimming
                        </span>
                      </div>

                      <div>
                        <span className="bg-blue-500 px-4 rounded-md text-white py-[2px]">
                          Reading Book
                        </span>
                      </div>

                      <div>
                        <span className="bg-teal-500 px-4 rounded-md text-white py-[2px]">
                          Travelling
                        </span>
                      </div>

                      <div>
                        <span className="bg-gray-500 px-4 rounded-md text-white py-[2px]">
                          Movie Watching
                        </span>
                      </div>
                      <div>
                        <span className=" sm:bg-yellow-500 px-4 rounded-md text-white py-[2px]">
                          Hiking
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                      <span className="text-blue-500">
                        <svg
                          className="h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path
                            fill="#fff"
                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                          />
                        </svg>
                      </span>
                      <span className="tracking-wide">Education</span>
                    </div>
                    <ul className="list-inside space-y-2">
                      <li>
                        <div className="text-blue-400">
                          Masters Degree in Oxford
                        </div>
                        <div className="text-gray-500 text-xs">
                          March 2020 - Now
                        </div>
                      </li>
                      <li>
                        <div className="text-blue-400">
                          Bachelors Degreen in LPU
                        </div>
                        <div className="text-gray-500 text-xs">
                          March 2020 - Now
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* End of Experience and education grid */}
              </div>
              {/* End of profile tab */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
