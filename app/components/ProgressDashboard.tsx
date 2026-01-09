"use client";

import { useState, useEffect, useMemo } from "react";
import { BodyPart } from "@/lib/body-parts/types";
import {
  OutcomeData,
  WeeklySummary,
  Milestone,
  ProgressInsight,
  loadOutcomeData,
  generateWeeklySummary,
  generateInsights,
  getOrCreateOutcomeData,
} from "@/lib/tracking/outcomes";

interface ProgressDashboardProps {
  bodyPart: BodyPart;
}

export function ProgressDashboard({ bodyPart }: ProgressDashboardProps) {
  const [data, setData] = useState<OutcomeData | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "trends" | "milestones">("overview");

  useEffect(() => {
    const outcomeData = loadOutcomeData(bodyPart);
    if (outcomeData) {
      setData(outcomeData);
    }
  }, [bodyPart]);

  const weeklySummary = useMemo(() => {
    if (!data) return null;
    return generateWeeklySummary(data);
  }, [data]);

  const insights = useMemo(() => {
    if (!data) return [];
    return generateInsights(data);
  }, [data]);

  const recentCheckIns = useMemo(() => {
    if (!data) return [];
    return data.checkIns.slice(-7);
  }, [data]);

  if (!data || data.checkIns.length === 0) {
    return (
      <div className="progress-dashboard empty">
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <h3>No Progress Data Yet</h3>
          <p className="muted">
            Complete your daily check-ins to start tracking your progress.
            We'll show trends, insights, and milestones here.
          </p>
        </div>
      </div>
    );
  }

  const streak = getConsecutiveDays(data.checkIns);
  const avgPain = recentCheckIns.reduce((s, c) => s + c.painLevel, 0) / recentCheckIns.length;
  const avgFunction = recentCheckIns.reduce((s, c) => s + c.functionLevel, 0) / recentCheckIns.length;

  return (
    <div className="progress-dashboard">
      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === "trends" ? "active" : ""}`}
          onClick={() => setActiveTab("trends")}
        >
          Trends
        </button>
        <button
          className={`tab ${activeTab === "milestones" ? "active" : ""}`}
          onClick={() => setActiveTab("milestones")}
        >
          Milestones
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="tab-content">
          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">🔥</span>
              <span className="stat-value">{streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📅</span>
              <span className="stat-value">{data.checkIns.length}</span>
              <span className="stat-label">Total Check-ins</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">💪</span>
              <span className="stat-value">{data.sessions.length}</span>
              <span className="stat-label">Sessions</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🏆</span>
              <span className="stat-value">{data.milestones.length}</span>
              <span className="stat-label">Milestones</span>
            </div>
          </div>

          {/* Current Averages */}
          <div className="averages-section">
            <h4>Last 7 Days</h4>
            <div className="average-bars">
              <div className="average-bar">
                <span className="bar-label">Pain Level</span>
                <div className="bar-track">
                  <div 
                    className="bar-fill pain" 
                    style={{ width: `${avgPain * 10}%` }}
                  />
                </div>
                <span className="bar-value">{avgPain.toFixed(1)}/10</span>
              </div>
              <div className="average-bar">
                <span className="bar-label">Function</span>
                <div className="bar-track">
                  <div 
                    className="bar-fill function" 
                    style={{ width: `${avgFunction * 10}%` }}
                  />
                </div>
                <span className="bar-value">{avgFunction.toFixed(1)}/10</span>
              </div>
            </div>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div className="insights-section">
              <h4>Insights</h4>
              <div className="insights-list">
                {insights.map((insight, i) => (
                  <div key={i} className={`insight-card ${insight.type}`}>
                    <span className="insight-icon">
                      {insight.type === "positive" ? "✨" : 
                       insight.type === "attention" ? "⚠️" : "ℹ️"}
                    </span>
                    <div className="insight-content">
                      <strong>{insight.title}</strong>
                      <p>{insight.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === "trends" && (
        <div className="tab-content">
          {weeklySummary ? (
            <>
              <div className="trend-cards">
                <div className={`trend-card ${weeklySummary.painTrend}`}>
                  <span className="trend-icon">
                    {weeklySummary.painTrend === "improving" ? "📉" : 
                     weeklySummary.painTrend === "worsening" ? "📈" : "➡️"}
                  </span>
                  <span className="trend-label">Pain</span>
                  <span className="trend-value">
                    {weeklySummary.painTrend === "improving" ? "Improving" :
                     weeklySummary.painTrend === "worsening" ? "Worsening" : "Stable"}
                  </span>
                </div>
                <div className={`trend-card ${weeklySummary.functionTrend === "improving" ? "improving" : weeklySummary.functionTrend === "worsening" ? "worsening" : "stable"}`}>
                  <span className="trend-icon">
                    {weeklySummary.functionTrend === "improving" ? "📈" : 
                     weeklySummary.functionTrend === "worsening" ? "📉" : "➡️"}
                  </span>
                  <span className="trend-label">Function</span>
                  <span className="trend-value">
                    {weeklySummary.functionTrend === "improving" ? "Improving" :
                     weeklySummary.functionTrend === "worsening" ? "Worsening" : "Stable"}
                  </span>
                </div>
              </div>

              {/* Mode Distribution */}
              <div className="mode-distribution">
                <h4>This Week's Modes</h4>
                <div className="mode-bars">
                  <div className="mode-bar">
                    <span className="mode-label reset">RESET</span>
                    <div className="mode-count">{weeklySummary.modeDistribution.RESET}</div>
                  </div>
                  <div className="mode-bar">
                    <span className="mode-label training">TRAINING</span>
                    <div className="mode-count">{weeklySummary.modeDistribution.TRAINING}</div>
                  </div>
                  <div className="mode-bar">
                    <span className="mode-label game">GAME</span>
                    <div className="mode-count">{weeklySummary.modeDistribution.GAME}</div>
                  </div>
                </div>
              </div>

              {/* Baseline Comparison */}
              {data.baseline && (
                <div className="baseline-comparison">
                  <h4>vs. Baseline</h4>
                  <div className="comparison-items">
                    <div className="comparison-item">
                      <span className="comparison-label">Pain</span>
                      <span className={`comparison-value ${weeklySummary.avgPainLevel < data.baseline.painLevel ? "positive" : weeklySummary.avgPainLevel > data.baseline.painLevel ? "negative" : ""}`}>
                        {weeklySummary.avgPainLevel < data.baseline.painLevel ? "↓" : weeklySummary.avgPainLevel > data.baseline.painLevel ? "↑" : "="}
                        {Math.abs(weeklySummary.avgPainLevel - data.baseline.painLevel).toFixed(1)} pts
                      </span>
                    </div>
                    <div className="comparison-item">
                      <span className="comparison-label">Function</span>
                      <span className={`comparison-value ${weeklySummary.avgFunctionLevel > data.baseline.functionLevel ? "positive" : weeklySummary.avgFunctionLevel < data.baseline.functionLevel ? "negative" : ""}`}>
                        {weeklySummary.avgFunctionLevel > data.baseline.functionLevel ? "↑" : weeklySummary.avgFunctionLevel < data.baseline.functionLevel ? "↓" : "="}
                        {Math.abs(weeklySummary.avgFunctionLevel - data.baseline.functionLevel).toFixed(1)} pts
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p className="muted">Complete more check-ins this week to see trends.</p>
            </div>
          )}

          {/* Recent Check-ins Mini Chart */}
          <div className="recent-checkins">
            <h4>Recent Pain Levels</h4>
            <div className="mini-chart">
              {recentCheckIns.map((checkIn, i) => (
                <div key={i} className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ height: `${checkIn.painLevel * 10}%` }}
                    title={`${new Date(checkIn.date).toLocaleDateString()}: ${checkIn.painLevel}/10`}
                  />
                  <span className="chart-label">
                    {new Date(checkIn.date).toLocaleDateString(undefined, { weekday: 'short' }).charAt(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === "milestones" && (
        <div className="tab-content">
          {data.milestones.length > 0 ? (
            <div className="milestones-list">
              {data.milestones.map((milestone, i) => (
                <div key={i} className="milestone-card">
                  <span className="milestone-icon">
                    {milestone.type === "pain_reduction" ? "💚" :
                     milestone.type === "function_improvement" ? "💪" :
                     milestone.type === "consistency" ? "🔥" :
                     milestone.type === "exercise_progression" ? "📈" :
                     milestone.type === "movement_unlocked" ? "🔓" : "🏆"}
                  </span>
                  <div className="milestone-content">
                    <strong>{milestone.title}</strong>
                    <p>{milestone.description}</p>
                    <span className="milestone-date">
                      {new Date(milestone.achievedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">🏆</span>
              <h3>No Milestones Yet</h3>
              <p className="muted">
                Keep checking in and exercising to unlock milestones!
              </p>
            </div>
          )}

          {/* Upcoming Milestones */}
          <div className="upcoming-milestones">
            <h4>Coming Up</h4>
            <div className="upcoming-list">
              {streak < 7 && (
                <div className="upcoming-item">
                  <span className="upcoming-icon">🔥</span>
                  <span>7-Day Streak ({7 - streak} more days)</span>
                </div>
              )}
              {data.sessions.length < 10 && (
                <div className="upcoming-item">
                  <span className="upcoming-icon">💪</span>
                  <span>10 Sessions ({10 - data.sessions.length} more)</span>
                </div>
              )}
              {!data.milestones.find(m => m.id === "PAIN_DOWN_2") && data.baseline && (
                <div className="upcoming-item">
                  <span className="upcoming-icon">💚</span>
                  <span>Reduce pain by 2 points</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function
function getConsecutiveDays(checkIns: { date: string }[]): number {
  if (checkIns.length === 0) return 0;
  
  const sorted = [...checkIns].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastCheckIn = new Date(sorted[0].date);
  lastCheckIn.setHours(0, 0, 0, 0);
  
  const daysSinceLastCheckIn = Math.floor(
    (today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceLastCheckIn > 1) return 0;
  
  for (let i = 1; i < sorted.length; i++) {
    const current = new Date(sorted[i - 1].date);
    const previous = new Date(sorted[i].date);
    
    const dayDiff = Math.floor(
      (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (dayDiff === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
