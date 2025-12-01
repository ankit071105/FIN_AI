import random
import json

class StrategyGenome:
    def __init__(self, indicators=None, thresholds=None):
        self.indicators = indicators or ["RSI", "MACD", "SMA"]
        self.thresholds = thresholds or {
            "RSI_Buy": 30,
            "RSI_Sell": 70,
            "SMA_Period": 20
        }
        self.fitness = 0

    def to_dict(self):
        return {
            "indicators": self.indicators,
            "thresholds": self.thresholds,
            "fitness": self.fitness
        }

class StrategyBreeder:
    def __init__(self):
        self.population = []
        self.generation = 0

    def initialize_population(self, size=10):
        self.population = [StrategyGenome() for _ in range(size)]
        # Randomize initial population
        for strat in self.population:
            self.mutate(strat)

    def crossover(self, parent_a, parent_b):
        """Combines logic from two strategies."""
        child = StrategyGenome()
        # Mix thresholds
        child.thresholds["RSI_Buy"] = (parent_a.thresholds["RSI_Buy"] + parent_b.thresholds["RSI_Buy"]) / 2
        child.thresholds["RSI_Sell"] = (parent_a.thresholds["RSI_Sell"] + parent_b.thresholds["RSI_Sell"]) / 2
        child.thresholds["SMA_Period"] = int((parent_a.thresholds["SMA_Period"] + parent_b.thresholds["SMA_Period"]) / 2)
        return child

    def mutate(self, strategy):
        """Randomly tweaks parameters."""
        mutation_rate = 0.1
        if random.random() < mutation_rate:
            strategy.thresholds["RSI_Buy"] += random.randint(-5, 5)
        if random.random() < mutation_rate:
            strategy.thresholds["RSI_Sell"] += random.randint(-5, 5)
        if random.random() < mutation_rate:
            strategy.thresholds["SMA_Period"] += random.randint(-2, 2)
        
        # Clamp values
        strategy.thresholds["RSI_Buy"] = max(10, min(45, strategy.thresholds["RSI_Buy"]))
        strategy.thresholds["RSI_Sell"] = max(55, min(90, strategy.thresholds["RSI_Sell"]))

    def fitness_function(self, strategy):
        """Runs a mock backtest and returns Sharpe Ratio."""
        # In a real app, this would run backtrader/vectorbt
        # Mocking fitness based on "reasonable" parameters
        score = 0
        if 25 < strategy.thresholds["RSI_Buy"] < 35: score += 0.5
        if 65 < strategy.thresholds["RSI_Sell"] < 75: score += 0.5
        
        # Add random noise for simulation
        score += random.uniform(-0.2, 0.2)
        strategy.fitness = max(0, score)
        return strategy.fitness

    def evolve(self):
        """Runs one generation of evolution."""
        self.generation += 1
        
        # 1. Evaluate Fitness
        for strat in self.population:
            self.fitness_function(strat)
            
        # 2. Selection (Top 50%)
        sorted_pop = sorted(self.population, key=lambda x: x.fitness, reverse=True)
        survivors = sorted_pop[:len(sorted_pop)//2]
        
        # 3. Breeding
        next_gen = []
        while len(next_gen) < len(self.population):
            parent_a = random.choice(survivors)
            parent_b = random.choice(survivors)
            child = self.crossover(parent_a, parent_b)
            self.mutate(child)
            next_gen.append(child)
            
        self.population = next_gen
        return [s.to_dict() for s in sorted_pop[:5]] # Return top 5 of previous gen

strategy_breeder = StrategyBreeder()
strategy_breeder.initialize_population()
