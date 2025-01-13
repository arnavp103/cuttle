"""Tracks state for game and implements game logic functions."""

import random

from enum import Enum
from dataclasses import dataclass
from typing import Literal

class Suit(Enum):
    HEARTS = "♥"
    DIAMONDS = "♦"
    CLUBS = "♣"
    SPADES = "♠"


class Rank(Enum):
    ACE = "1"
    TWO = "2"
    THREE = "3"
    FOUR = "4"
    FIVE = "5"
    SIX = "6"
    SEVEN = "7"
    EIGHT = "8"
    NINE = "9"
    TEN = "10"
    JACK = "J"
    QUEEN = "Q"
    KING = "K"

class Card:
    def __init__(self, rank: Rank, suit: Suit):
        self.rank = rank
        self.suit = suit
    
    def __str__(self):
        return f"{self.rank.name} of {self.suit.name}"

@dataclass
class Hand:
    cards: set[Card]
    
    def add_card(self, card: Card):
        self.cards.add(card)
    
    def remove_card(self, card: Card):
        self.cards.remove(card)


class Game:
    def __init__(self):
        self.deck = [Card(rank, suit) for rank in Rank for suit in Suit]
        random.shuffle(self.deck)
        
        self.dealer_hand = Hand(set())
        self.player_hand = Hand(set())
        self.deck = Hand(set())
        self.scrap = Hand(set())
        
        # 3 consecutive passes ends the game with a draw
        self.consecutive_passes = 0
        
        # The current player to move
        self.current_player: Literal["player", "dealer"] = "player"

        # The current player that holds priority
        self.priority: Literal["player", "dealer"] = self.current_player




    def set_up():
        """Set up the game state."""
        
        # Create and shuffle deck
        deck = [Card(rank, suit) for rank in Rank for suit in Suit]
        random.shuffle(deck)

        # Deal cards
        
        pass


    def draw_card(self):
        """Draw a card from the deck."""
        self.consecutive_passes = 0
        
        pass


    def play_point_card(self, card, one_off):
        """Play a point card from current player's hand."""
        self.consecutive_passes = 0
        
        if card not in self.current_player.hand:
            print("Error: Card not in hand.")

        # resolve_card()

    def pass_turn(self):
        """Pass the turn to the other player."""
        self.consecutive_passes += 1
        self.current_player = "dealer" if self.current_player == "player" else "player"