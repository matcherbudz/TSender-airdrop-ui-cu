"use client"
import InputField from '@/components/ui/InputField'
import { useState, useMemo, useEffect } from 'react'
import { AlertCircle, Send, } from 'lucide-react'
import { chainsToTSender, tsenderAbi, erc20Abi } from '@/constants'
import { useChainId, useConfig, useAccount, useWriteContract, useReadContracts, useWaitForTransactionReceipt } from 'wagmi'
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { calculateTotal } from '@/utils'
import { CgSpinner } from "react-icons/cg"
import { formatUnits } from 'viem'

export default function AirdropForm() {
    // Initialize state from localStorage
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const config = useConfig()
    const account = useAccount()
    const chainId = useChainId()
    const { data: tokenData } = useReadContracts({
        contracts: [
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "decimals",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "name",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "balanceOf",
                args: [account.address],
            },
        ],
    })
    const [hasEnoughTokens, setHasEnoughTokens] = useState(true)

    const { data: hash, isPending, writeContractAsync } = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed, isError } = useWaitForTransactionReceipt({
        confirmations: 1,
        hash,
    })

    const total: number = useMemo(() => calculateTotal(amounts), [amounts])

    const cleanTokenAddress = tokenAddress.trim()

    const parseAddresses = (input: string): string[] => {
        return input
            .split(/[\n,]+/)
            .map(addr => addr.trim())
            .filter(addr => addr.length > 0)
    }

    const parseAmounts = (input: string): string[] => {
        return input
            .split(/[\n,]+/) // Split by newlines OR commas
            .map(amt => amt.trim()) // Remove whitespace
            .filter(amt => amt.length > 0) // Remove empty strings
    }

    const calculateTotalAmount = (amountsArray: string[]): string => {
        return amountsArray.reduce((sum, amt) => {
            return sum + BigInt(amt)
        }, BigInt(0)).toString()
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedToken = localStorage.getItem('tokenAddress')
            const savedRecipients = localStorage.getItem('recipients')
            const savedAmounts = localStorage.getItem('amounts')

            if (savedToken) setTokenAddress(savedToken)
            if (savedRecipients) setRecipients(savedRecipients)
            if (savedAmounts) setAmounts(savedAmounts)
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('tokenAddress', tokenAddress)
        }
    }, [tokenAddress])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('recipients', recipients)
        }
    }, [recipients])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('amounts', amounts)
        }
    }, [amounts])

    useEffect(() => {
        if (tokenAddress && total > 0 && tokenData?.[2]?.result as number !== undefined) {
            const userBalance = tokenData?.[2].result as number;
            setHasEnoughTokens(userBalance >= total);
        } else {
            setHasEnoughTokens(true);
        }
    }, [tokenAddress, total, tokenData]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSuccess('')

        // validate before any contract calls
        const trimmedTokenAddress = tokenAddress.trim()
        console.log("Token Address:", trimmedTokenAddress)
        console.log("Chain ID:", chainId)
        // validate token address
        if (!trimmedTokenAddress || !trimmedTokenAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
            setError('Invalid token address format')
            return
        }

        // Parse recipients and amounts
        const recipientsArray = parseAddresses(recipients)
        const amountsArray = parseAmounts(amounts)

        // Validate recipients
        if (recipientsArray.length === 0) {
            setError('Please enter at least one recipient address')
            return
        }

        // Validate all recipient addresses
        const invalidRecipient = recipientsArray.find(
            addr => !addr.match(/^0x[a-fA-F0-9]{40}$/)
        )
        if (invalidRecipient) {
            setError(`Invalid recipient address: ${invalidRecipient}`)
            return
        }

        // Validate amounts
        if (amountsArray.length === 0) {
            setError('Please enter at least one amount')
            return
        }

        // Check if recipients and amounts match
        if (recipientsArray.length !== amountsArray.length) {
            setError(`Mismatch: ${recipientsArray.length} recipients but ${amountsArray.length} amounts`)
            return
        }

        // Validate amounts are valid numbers
        try {
            amountsArray.forEach(amt => BigInt(amt))
        } catch (err) {
            setError('All amounts must be valid wei amounts (positive integers)')
            return
        }



        // CONTRACT CALLS
        // 1a. If already approve3d, move onto step 2
        // 1. Approve tsender contract to send our tokens
        // 2. Call the airdrop function on the tsender contract
        // 3. Wait for the transaction to be mined
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        console.log("tsenderAddress", tSenderAddress)
        console.log(chainId)

        const result = await getApprovedAmount(tSenderAddress)
        console.log("approved amount", result)

        if (result < total) {
            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress as `0x${string}`, BigInt(total)]
            })
            const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvalHash
            })
            console.log("Approval confirmed", approvalReceipt)

            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // comma or new line separated should create a function outside of this but for now this is good
                    recipients.split(/[,\n\s]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n\s]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ]
            })
        } else {
            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // comma or new line separated should create a function outside of this but for now this is good
                    recipients.split(/[,\n\s]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n\s]+/).map(amt => amt.trim()).filter(amt => amt !== '').map(amt => BigInt(amt)),
                    BigInt(total),
                ]
            })
        }

        async function getApprovedAmount(cleanTokenAddress: string | null): Promise<number> {
            if (!cleanTokenAddress) {
                alert("No address found, please use a supported chain")
                return 0
            }
            // read from the chain to see if we have approved enough tokens
            const response = await readContract(config, { //the response is how much is being approved here
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "allowance",
                args: [account.address, cleanTokenAddress as `0x${string}`],
                // in a smart contract this would be like saying token.allowance(account,tsender)
            })
            return response as number
        }
    }

    function getButtonContent() {
        if (isPending)
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <CgSpinner className="animate-spin" size={20} />
                    <span>Confirming in wallet...</span>
                </div>
            )
        if (isConfirming)
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <CgSpinner className="animate-spin" size={20} />
                    <span>Waiting for transaction to be included...</span>
                </div>
            )
        if (error || isError) {
            console.log(error)
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <span>Error, see console.</span>
                </div>
            )
        }
        if (isConfirmed) {
            return "Transaction confirmed."
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Jeff's Airdrop Sender</h1>
                        <p className="text-blue-200">Distribute tokens to multiple recipients</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField
                            label="Token Contract Address (The ERC20 Token contract address you're airdropping the tokens from)"
                            value={tokenAddress}
                            onChange={setTokenAddress}
                            placeholder="0x..."
                            type="text"
                        />

                        <InputField
                            label="Recipients (addresses you want to airdrop to) separated by a comma , or a new line"
                            value={recipients}
                            onChange={setRecipients}
                            placeholder="0x00, 0x00, 0x00..."
                            type="textarea"
                            rows={8}
                        />

                        <InputField
                            label="Amounts in Wei for each recipent separated by comma or new line"
                            value={amounts}
                            onChange={setAmounts}
                            placeholder="100000, 200000, 300000..."
                            type="textarea"
                            rows={8}
                        />

                        <div className="bg-gradient-to-br from-purple-300 via-blue-300 to-indigo-300 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-zinc-900 mb-3">Transaction Details</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-zinc-600">Token Name:</span>
                                    <span className="font-mono text-zinc-900">
                                        {tokenData?.[1]?.result as string}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-zinc-600">Amount (tokens):</span>
                                    <span className="font-mono text-zinc-900">
                                        {formatUnits(BigInt(total), tokenData?.[0]?.result as number)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-zinc-600">Recipients</span>
                                    <span className="font-mono test-zinc-900">{parseAddresses(recipients).length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-400 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="text-red-300 flex-shrink-0 mt-0.5" size={20} />
                                <p className="text-red-200">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
                                <p className="text-green-200">{success}</p>
                            </div>
                        )}


                        <button
                            type="submit"
                            disabled={isPending || isConfirming || isConfirmed}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending || isConfirming || isConfirmed || error || isError ? (
                                getButtonContent()
                            ) : (
                                <>
                                    <Send size={30} />
                                    Prepare Airdrop
                                </>
                            )}
                        </button>

                        {isConfirmed && (
                            <button
                                type="button"
                                onClick={() => {
                                    setTokenAddress('')
                                    setRecipients('')
                                    setAmounts('')
                                    setError('')
                                    setSuccess('')
                                    window.location.reload()
                                }}
                                className="w-full bg-gradient-to-r from-green-500 to-teal-600..."
                            >
                                Reset airdrop forms
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
