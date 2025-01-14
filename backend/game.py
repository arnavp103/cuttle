"""Tracks state for game and implements game logic functions."""

import random

from enum import Enum
from dataclasses import dataclass
from typing import Literal

class Suit(Enum):
    CLUBS = "♣"
    DIAMONDS = "♦"
    HEARTS = "♥"
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

def can_scuttle(card1: Card, card2: Card) -> bool:
    """Check if card1 can scuttle card2."""
    # card 1 must be higher value than card 2 and both must be point cards
    # if same value then can scuttle according to suit priority
    # clubs < diamonds < hearts < spades

    if card1.rank.value > card2.rank.value:
        return True
    if card1.rank.value == card2.rank.value:
        # todo: check if this works
        return card1.suit.value > card2.suit.value

@dataclass
class Hand:
    cards: set[Card]
    value: int
    
    def add_card(self, card: Card):
        self.cards.add(card)
    
    def remove_card(self, card: Card):
        self.cards.remove(card)
        return card

@dataclass
class Player:
    hand: Hand = Hand(set())
    points: Hand = Hand(set())
    effects: Hand = Hand(set())
    cur_points: int = 0
    win_con: int = 21
    dealer: bool


class Game:
    def __init__(self):
        # Initialize game state and set up game
        
        self.dealer = Player(True)
        self.player = Player(False)

        self.scrap = Hand(set())
        self.winner = None
        
        # Create and shuffle deck
        self.deck = [Card(rank, suit) for rank in Rank for suit in Suit]
        random.shuffle(self.deck)
        
        # Deal cards
        for i in range(11):
            if i % 2 == 0:
                # Dealer gets 6 cards
                self.dealer.hand.add_card(self.deck.remove_card())
            else:
                # Player gets 5 cards
                self.player.hand.add_card(self.deck.remove_card())

        # 3 consecutive passes ends the game with a draw
        self.consecutive_passes = 0
        
        # The current player to move
        self.current_player: Player = self.player

        # The current player that holds priority
        self.priority: Player = self.current_player
        


    def draw_card(self):
        """Draw a card from the deck."""
        self.consecutive_passes = 0
        
        self.end_turn()

    def resolve_point_card(self, card: Card, scuttle: bool, target: Card):
        """Resolve the effect of a card."""
        if card.rank in [Rank.EIGHT, Rank.JACK, Rank.QUEEN, Rank.KING]:
            print("Error: Card is not a point card.")
        if scuttle:
            opponent = self.dealer if self.current_player == "player" else self.player
            if can_scuttle(card, target):
                opponent.cur_points += card.rank
                self.scrap.add_card(opponent.points.remove_card(card))
            else:
                print("Error: Card cannot scuttle target.")
        else:
            self.current_player.cur_points += card.rank
            self.current_player.points.add_card(card)
            if self.current_player.cur_points >= self.current_player.win_con:
                self.winner = self.current_player
                # todo: end_game()
        self.end_turn()


    def play_point_card(self, card: Card, one_off):
        """Play a point card from current player's hand."""
        self.consecutive_passes = 0
        
        if card not in self.current_player.hand:
            print("Error: Card not in hand.")

        # Remove card from player's hand
        self.current_player.hand.remove_card(card)
        self.resolve_point_card(card)
        
    def pass_turn(self):
        self.consecutive_passes += 1
        self.end_turn()

    def end_turn(self):
        """End your turn and give control to the other player."""
        self.current_player = self.dealer if self.current_player == self.player else self.player
        self.priority = self.current_player