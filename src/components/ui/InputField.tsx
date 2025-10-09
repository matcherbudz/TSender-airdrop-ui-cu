"use client"
interface InputFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder: string
    type?: 'text' | 'textarea'
    rows?: number
}

export default function InputField({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    rows = 8
}: InputFieldProps) {
    const baseClasses = "w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"

    return (
        <div>
            <label className="block text-white font-semibold mb-2">
                {label}
            </label>
            {type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    className={`${baseClasses} font-mono text-sm`}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value.trim())}
                    placeholder={placeholder}
                    className={baseClasses}
                />
            )}
        </div>
    )
}