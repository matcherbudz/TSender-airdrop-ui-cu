import { describe, it, expect } from 'vitest'
import { calculateTotal } from './calculateTotal'

describe('calculateTotal', () => {
    it('should handle ignoring letters and only work with numbers', () => {
        expect(calculateTotal('sdhjasdfhkjasd12  12')).toBe(24)
        expect(calculateTotal('abc123,def456')).toBe(579)
        expect(calculateTotal('100dollars,200euros')).toBe(300)
        expect(calculateTotal('test50\nvalue75')).toBe(125)
        expect(calculateTotal('xyz')).toBe(0)
    })

    it('should calculate sum of comma-separated values', () => {
        expect(calculateTotal('10,20,30')).toBe(60)
    })

    it('should handle mixed delimiters', () => {
        expect(calculateTotal('100,200\n300')).toBe(600)
        expect(calculateTotal('1.5\n2.5,3.5')).toBe(7.5)
        expect(calculateTotal('200,,300\n\n400')).toBe(900)
    })

    it('should handle empty input', () => {
        expect(calculateTotal('')).toBe(0)
        expect(calculateTotal(',\n,     ')).toBe(0)
    })

    it('should ignore invalid numbers', () => {
        expect(calculateTotal('abc,100')).toBe(100)
        expect(calculateTotal('100,abc')).toBe(100)
        expect(calculateTotal('12three\n45')).toBe(57)
        expect(calculateTotal('12three   45')).toBe(57)
        expect(calculateTotal('123.45.67')).toBe(123.45)
    })

    it('should calculate sum of newline-separated values', () => {
        expect(calculateTotal('10\n20\n30')).toBe(60)
    })

    it('should handle mixed comma and newline separators', () => {
        expect(calculateTotal('10,20\n30,40')).toBe(100)
    })

    it('should handle decimal values', () => {
        expect(calculateTotal('10.5,20.25,30.75')).toBe(61.5)
        expect(calculateTotal('1.1\n2.2,3.3')).toBe(6.6)
        expect(calculateTotal('123.45.67')).toBe(123.45)
    })

    it('should trim whitespace around values', () => {
        expect(calculateTotal('  10  , 20 ,  30  ')).toBe(60)
    })

    it('should handle empty strings between separators', () => {
        expect(calculateTotal('10,,20,,,30')).toBe(60)
    })

    it('should ignore invalid numbers and sum valid ones', () => {
        expect(calculateTotal('10,invalid,20,30')).toBe(60)
    })

    it('should return 0 for empty string', () => {
        expect(calculateTotal('')).toBe(0)
    })

    it('should return 0 for only separators', () => {
        expect(calculateTotal(',,,\n\n')).toBe(0)
    })

    it('should handle single value', () => {
        expect(calculateTotal('42')).toBe(42)
    })

    it('should handle negative numbers', () => {
        expect(calculateTotal('-10,20,-5')).toBe(5)
    })

    it('should handle zero values', () => {
        expect(calculateTotal('0,0,0')).toBe(0)
    })

    it('should handle large numbers', () => {
        expect(calculateTotal('1000000,2000000,3000000')).toBe(6000000)
    })
})