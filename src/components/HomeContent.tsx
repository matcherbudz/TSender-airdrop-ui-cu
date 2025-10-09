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
                 <div style={{ fontSize: '80px' }} className="flex flex-col items-center justify-center">
                    <div>Please connect a wallet</div>
                    <div>\(^.^)/</div>
                </div>
            )}
        </main>
    )
}
