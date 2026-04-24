"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { TrendingUp, Target, TrendingDown } from "lucide-react";

interface TradingStatsProps {
    totalTradesAnalyzed: number;
    successfulPredictions: number;
    winRate: number;
    favoriteAssets: string[];
}

export function TradingStats({
    totalTradesAnalyzed,
    successfulPredictions,
    winRate,
    favoriteAssets,
}: TradingStatsProps) {
    const failedPredictions = totalTradesAnalyzed - successfulPredictions;

    const predictionData = [
        { name: "Successful", value: successfulPredictions, fill: "#10b981" },
        { name: "Unsuccessful", value: failedPredictions, fill: "#ef4444" },
    ];

    const assetData = [
        { name: "EUR/USD", trades: 45 },
        { name: "BTC/USD", trades: 38 },
        { name: "SPY", trades: 32 },
        { name: "Gold", trades: 28 },
        { name: "Oil", trades: 24 },
    ];

    return (
        <div className="space-y-6">
            {/* Win Rate Overview */}
            <Card className="border-border/50 shadow-sm overflow-hidden bg-gradient-to-br from-card to-card/50">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                        Trading Performance
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-muted-foreground">Win Rate</span>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-green-500">{winRate.toFixed(1)}%</span>
                                <Target className="w-5 h-5 text-green-500/50" />
                            </div>
                        </div>
                        <Progress value={winRate} className="h-2.5 bg-muted/50" />
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>{successfulPredictions} wins</span>
                            <span>{failedPredictions} losses</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/40">
                        <div className="text-center p-3 rounded-lg bg-muted/20">
                            <div className="text-2xl font-bold text-foreground">{totalTradesAnalyzed}</div>
                            <div className="text-xs text-muted-foreground mt-1">Total Analyzed</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-green-500/10">
                            <div className="text-2xl font-bold text-green-500">{successfulPredictions}</div>
                            <div className="text-xs text-muted-foreground mt-1">Successful</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-red-500/10">
                            <div className="text-2xl font-bold text-red-500">{failedPredictions}</div>
                            <div className="text-xs text-muted-foreground mt-1">Failed</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Prediction Distribution Pie Chart */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Prediction Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={predictionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {predictionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <ChartTooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-6 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span>Successful</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span>Unsuccessful</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Asset Performance */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-base">
                        <TrendingDown className="w-4 h-4 mr-2" />
                        Asset Analysis by Trades
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={assetData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <ChartTooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                }}
                            />
                            <Bar dataKey="trades" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
