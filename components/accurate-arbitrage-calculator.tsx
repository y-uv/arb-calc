"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Calculator() {
  const [odds1, setOdds1] = useState(2.5)
  const [odds2, setOdds2] = useState(2.0)
  const [profit, setProfit] = useState(10)
  const [confidence, setConfidence] = useState(50)
  const [result, setResult] = useState({ stake1: 0, stake2: 0, totalStake: 0, roi: 0, profit1: 0, profit2: 0 })
  const [isValidArb, setIsValidArb] = useState(true)

  const calculateArbitrage = (odds1: number, odds2: number, profit: number, confidence: number) => {
    const impliedProbability = (1 / odds1) + (1 / odds2);
  
    if (impliedProbability >= 1) {
      // Not a valid arbitrage opportunity
      return { stake1: 0, stake2: 0, totalStake: 0, roi: 0, profit1: 0, profit2: 0 };
    }
  
    const confidenceRatio = confidence / 100;
  
    // Total profit target we want to achieve
    const totalProfit = profit;
  
    // Initial guess for stake2 and tolerance for convergence
    let stake1 = 0; // Initialize stake1 to 0 to avoid undefined
    let stake2 = profit; // Initial guess for stake2
    const tolerance = 0.00; // Tolerance for the iterative difference
    let difference = Infinity;
  
    // Iterative process to calculate correct stake1 and stake2
    while (Math.abs(difference) > tolerance) {
      // Step 1: Calculate stake1 based on stake2
      stake1 = (profit + stake2) / (odds1 - 1);
  
      // Step 2: Calculate new stake2 based on stake1
      const newStake2 = (profit + stake1) / (odds2 - 1);
  
      // Update difference between old and new stake2
      difference = newStake2 - stake2;
  
      // Update stake2 for the next iteration
      stake2 = newStake2;
    }
  
    // Calculate the total stake and ROI
    const totalStake = stake1 + stake2;
    const roi = (totalProfit / totalStake) * 100;
  
    // Profit for both cases (corrected calculation)
    const profit1 = stake1 * odds1 - totalStake;
    const profit2 = stake2 * odds2 - totalStake;
  
    return {
      stake1,
      stake2,
      totalStake,
      roi,
      profit1,
      profit2,
    };
  };
  
  useEffect(() => {
    setResult(calculateArbitrage(odds1, odds2, profit, confidence))
  }, [odds1, odds2, profit, confidence])

  const inputClasses = `w-full text-sm bg-gray-800 border-gray-700 text-white focus:ring-gray-700 focus:border-gray-600`

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-mono">
      <Card className="w-full max-w-md bg-gray-800 text-white shadow-xl border border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-2xl font-bold text-white lowercase">accurate arbitrage calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="odds1" className="text-sm font-medium text-gray-300">
                game 1
              </Label>
              <Input
                id="odds1"
                type="number"
                value={odds1}
                onChange={(e) => setOdds1(parseFloat(e.target.value))}
                className={inputClasses}
                step="0.01"
                min="1.01"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="odds2" className="text-sm font-medium text-gray-300">
                game 2
              </Label>
              <Input
                id="odds2"
                type="number"
                value={odds2}
                onChange={(e) => setOdds2(parseFloat(e.target.value))}
                className={inputClasses}
                step="0.01"
                min="1.01"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="profit" className="text-sm font-medium text-gray-300">
                profit
              </Label>
              <span className="text-sm font-semibold text-white">${profit}</span>
            </div>
            <Slider
              id="profit"
              min={1}
              max={100}
              step={1}
              value={[profit]}
              onValueChange={(value) => setProfit(value[0])}
              className="w-full"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="confidence" className="text-sm font-medium text-gray-300">
                confidence (odds 1 / odds 2)
              </Label>
              <span className="text-sm font-semibold text-white">{100 - confidence}% / {confidence}%</span>
            </div>
            <Slider
              id="confidence"
              min={0}
              max={100}
              step={1}
              value={[confidence]}
              onValueChange={(value) => setConfidence(value[0])}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-400">bet amount 1</Label>
              <p className="text-lg font-semibold text-white">
                {isValidArb ? `$${result.stake1.toFixed(2)}` : 'n/a'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-400">bet amount 2</Label>
              <p className="text-lg font-semibold text-white">
                {isValidArb ? `$${result.stake2.toFixed(2)}` : 'n/a'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-400">profit if 1 wins</Label>
              <p className="text-lg font-semibold text-white">
                {isValidArb ? `$${result.profit1.toFixed(2)}` : 'n/a'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-400">profit if 2 wins</Label>
              <p className="text-lg font-semibold text-white">
                {isValidArb ? `$${result.profit2.toFixed(2)}` : 'n/a'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-400">total stake</Label>
              <p className="text-lg font-semibold text-white">
                {isValidArb ? `$${result.totalStake.toFixed(2)}` : 'n/a'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-400">roi</Label>
              <p className="text-lg font-semibold text-white">
                {isValidArb ? `${result.roi.toFixed(2)}%` : 'n/a'}
              </p>
            </div>
          </div>
          {!isValidArb && (
            <p className="text-red-400 text-sm mt-2">
              invalid arbitrage opportunity. adjust the odds to create a profitable arbitrage.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}