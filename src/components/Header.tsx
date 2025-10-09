"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { FaGithub } from "react-icons/fa"
import Image from "next/image"

export default function Header() {
    return (
        <header className="w-full border-b border-gray-200 bg-indigo-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Title and GitHub */}
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-gray-900">tsender</h1>
                        <a
                            href="https://github.com/matcherbudz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            aria-label="GitHub"
                        >
                            <FaGithub size={30} />
                        </a>
                    </div>

                    {/* Right side - Connect Button */}
                    <div>
                        <ConnectButton />
                    </div>
                </div>
            </div>
        </header>
    )
}