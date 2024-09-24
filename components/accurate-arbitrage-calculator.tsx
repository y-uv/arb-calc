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
  const [weight, setWeight] = useState(50)
  const [result, setResult] = useState({ stake1: 0, stake2: 0, totalStake: 0, roi: 0, profit1: 0, profit2: 0 })
  const [isValidArb, setIsValidArb] = useState(true)

  const calculateArbitrage = (odds1: number, odds2: number, targetProfit: number, weight: number) => {
    const impliedProbability = (1 / odds1) + (1 / odds2);
  
    if (impliedProbability >= 1) {
      setIsValidArb(false);
      return { stake1: 0, stake2: 0, totalStake: 0, roi: 0, profit1: 0, profit2: 0 };
    }

    setIsValidArb(true);

    let targetProfit1 = targetProfit;
    let targetProfit2 = targetProfit;

    if (weight < 50) {
      targetProfit2 = targetProfit * (weight / 50);
    } else if (weight > 50) {
      targetProfit1 = targetProfit * ((100 - weight) / 50);
    }

    let stake1 = targetProfit1 / (odds1 - 1);
    let stake2 = targetProfit2 / (odds2 - 1);

    const tolerance = 0.00;
    let difference = Infinity;

    while (Math.abs(difference) > tolerance) {
      const newStake1 = (targetProfit1 + stake2) / (odds1 - 1);
      const newStake2 = (targetProfit2 + stake1) / (odds2 - 1);

      difference = (newStake1 - stake1) + (newStake2 - stake2);

      stake1 = newStake1;
      stake2 = newStake2;
    }

    const totalStake = stake1 + stake2;
    const profit1 = stake1 * odds1 - totalStake;
    const profit2 = stake2 * odds2 - totalStake;
    const roi = ((profit1 + profit2) / 2 / totalStake) * 100;

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
    setResult(calculateArbitrage(odds1, odds2, profit, weight))
  }, [odds1, odds2, profit, weight])

  const inputClasses = `w-full text-sm bg-gray-700 border-gray-600 text-white focus:ring-gray-600 focus:border-gray-500 focus:outline-none appearance-none`

  const getColor = (weight: number) => {
    const blue = [96, 165, 250]; // tailwind blue-400
    const purple = [192, 132, 252]; // tailwind purple-400
    const r = Math.round(blue[0] * (1 - weight/100) + purple[0] * (weight/100));
    const g = Math.round(blue[1] * (1 - weight/100) + purple[1] * (weight/100));
    const b = Math.round(blue[2] * (1 - weight/100) + purple[2] * (weight/100));
    return `rgb(${r}, ${g}, ${b})`;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-mono select-none">
      <Card className="w-full max-w-md bg-gray-800 text-white shadow-xl border border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-2xl font-bold text-white lowercase">yuvz arbitrage calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="odds1" className="text-sm font-medium" style={{color: getColor(0)}}>
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
                style={{color: getColor(0)}}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="odds2" className="text-sm font-medium" style={{color: getColor(100)}}>
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
                style={{color: getColor(100)}}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="profit" className="text-sm font-medium text-gray-400">
                profit
              </Label>
              <span className="text-sm font-semibold text-gray-300">${profit}</span>
            </div>
            <Slider
              id="profit"
              min={1}
              max={100}
              step={1}
              value={[profit]}
              onValueChange={(value) => setProfit(value[0])}
              className="w-full rounded-md h-3"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="weight" className="text-sm font-medium text-gray-400">
                bias
              </Label>
              <div className="text-sm font-semibold text-gray-300 flex items-center justify-end">
                <span className="mr-1 overflow-hidden whitespace-nowrap text-ellipsis">
                  {(100 - weight).toString().padStart(3, '\u00A0')}%
                </span>
                <span className="mx-1">/</span>
                <span className="ml-1 overflow-hidden whitespace-nowrap text-ellipsis">
                  {weight.toString().padStart(3, '\u00A0')}%
                </span>
              </div>
            </div>
            <Slider
              id="weight"
              min={0}
              max={100}
              step={1}
              value={[weight]}
              onValueChange={(value) => setWeight(value[0])}
              className="w-full rounded-md h-3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">stake 1</Label>
              <p className="text-lg font-semibold" style={{color: getColor(0)}}>
                {isValidArb ? `$${result.stake1.toFixed(2)}` : 'n/a'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">stake 2</Label>
              <p className="text-lg font-semibold" style={{color: getColor(100)}}>
                {isValidArb ? `$${result.stake2.toFixed(2)}` : 'n/a'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">profit if 1</Label>
              <p className="text-lg font-semibold" style={{color: getColor(0)}}>
                {isValidArb ? `$${result.profit1.toFixed(2)}` : 'n/a'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">profit if 2</Label>
              <p className="text-lg font-semibold" style={{color: getColor(100)}}>
                {isValidArb ? `$${result.profit2.toFixed(2)}` : 'n/a'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">total stake</Label>
              <p className="text-lg font-semibold text-gray-300">
                {isValidArb ? `$${result.totalStake.toFixed(2)}` : 'n/a'}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">roi</Label>
              <p className="text-lg font-semibold text-green-400">
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