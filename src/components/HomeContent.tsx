"use client"

import { useState } from "react"
import AirdropForm from "@/components/AirdropForm"
import { useAccount } from "wagmi"

export default function HomeContent() {
    const [isUnsafeMode, setIsUnsafeMode] = useState(false)
    const { isConnected } = useAccount()

    return (
        <main>
            {isConnected ? (

                <div>
                    <AirdropForm />
                </div>

            ) : (
                <div style={{ fontSize: '80px' }} className="flex items-center justify-center">
                    Please connect a wallet \(^.^)/
                </div>
            )}
        </main>
    )
}