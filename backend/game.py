"""Tracks state for game and implements game logic functions."""

import random

from enum import Enum
from dataclasses import dataclass

class Suit(Enum):
    CLUBS = "♣"
    DIAMONDS = "♦"
    HEARTS = "♥"
    SPADES = "♠"


class Rank(Enum):
    ACE = 1
    TWO = 2
    THREE = 3
    FOUR = 4
    FIVE = 5
    SIX = 6
    SEVEN = 7
    EIGHT = 8
    NINE = 9
    TEN = 10
    JACK = "J"
    QUEEN = "Q"
    KING = "K"

class Card:
    def __init__(self, rank: Rank, suit: Suit):
        self.rank = rank
        self.suit = suit
        self.jacks = 0
    
    def __str__(self):
        return f"{self.rank.name} of {self.suit.name}"
    
    def can_be_point(self) -> bool:
        # Ace, 2, 3, 4, 5, 6, 7, 8, 9, 10 can be played as point cards.
        return self.rank not in [Rank.JACK, Rank.QUEEN, Rank.KING]
    
    def can_be_one_off(self) -> bool:
        # Ace, 2, 3, 4, 5, 6, 7, 9 can be played as one-off effect cards.
        return self.rank in [
            Rank.ACE,
            Rank.TWO,
            Rank.THREE,
            Rank.FOUR,
            Rank.FIVE,
            Rank.SIX,
            Rank.SEVEN,
            Rank.NINE,
        ]
    
    def can_be_permanent(self) -> bool:
        # 8, Jack, Queen, King can be played as permanent effect cards
        return self.rank in [Rank.EIGHT, Rank.JACK, Rank.QUEEN, Rank.KING]


def can_scuttle(card1: Card, card2: Card) -> bool:
    """Check if card1 can scuttle card2."""
    # card 1 must be higher value than card 2 and both must be point cards
    # if same value then can scuttle according to suit priority
    # clubs < diamonds < hearts < spades

    if not card2.can_be_point():
        return False
    
    if not card1.can_be_point():
        return False

    if card1.rank.value > card2.rank.value: # type: ignore
        return True
    if card1.rank.value == card2.rank.value:
        # todo: check if this works
        return card1.suit.value > card2.suit.value
    
    return False

@dataclass
class Hand:
    cards: set[Card]
    
    def add_card(self, card: Card):
        self.cards.add(card)
    
    def remove_card(self, card: Card):
        self.cards.remove(card)
        return card

    def __iter__(self):
        return iter(self.cards)

@dataclass
class Player:
    hand: Hand = Hand(set())
    points: Hand = Hand(set())
    effects: Hand = Hand(set())
    cur_points: int = 0
    win_con: int = 21
    hand_visible: bool = False


class Game:
    def __init__(self):
        # Initialize game state and set up game
        
        self.dealer = Player()
        self.player = Player()

        self.scrap = Hand(set())
        self.winner = None
        
        # Create and shuffle deck
        self.deck = [Card(rank, suit) for rank in Rank for suit in Suit]
        random.shuffle(self.deck)
        
        # Deal cards
        for i in range(11):
            if i % 2 == 0:
                # Dealer gets 6 cards but they start second
                self.dealer.hand.add_card(self.deck.pop())
            else:
                # Player gets 5 cards
                self.player.hand.add_card(self.deck.pop())

        # 3 consecutive passes ends the game with a draw
        self.consecutive_passes = 0
        
        # The current player to move
        self.current_player: Player = self.player

        # The current player that holds priority
        self.priority: Player = self.current_player

        def jacked(self, target: Card):
            aggressor = self.player if target in self.player.points else self.player
            victim = self.dealer if target in self.player.points else self.player
            aggressor.points.add_card(victim.points.remove_card(target))
            target.jacks += 1

        def unjacked(self, target: Card):
            aggressor = self.player if target in self.player.points else self.player
            opponent = self.dealer if target in self.current_player.points else self.player
            opponent.points.add_card(aggressor.points.remove_card(target))
            target.jacks -= 1
        
    def generate_legal_moves(self, hand: Hand, temp_draw: bool) -> list[str]:
        """Generate all legal moves that the current player can take for the frontend to decide on."""
        
        moves = []
        if not temp_draw:
            if len(self.deck) != 0:
                moves.append("draw card")
            else:
                moves.append("pass turn")
        
        opponent = self.dealer if self.current_player == self.player else self.player
        for card in hand:
            if card.can_be_point():
                moves.append(f"play {card} as point")
                for opp_card in opponent.points:
                    if can_scuttle(card, opp_card):
                        moves.append(f"scuttle {opp_card} with {card}")
            
            if card.can_be_one_off():
                # seperate messages for each one off card
                if card.rank == Rank.ACE:
                    moves.append(f"scrap all cards with {card}")
                if card.rank == Rank.TWO:
                    for opp_perm in opponent.effects:
                        moves.append(f"scuttle {opp_perm} with {card}")
        
        return moves

    def draw_card(self):
        """Draw a card from the deck."""
        self.consecutive_passes = 0
        drawn_card = self.deck.pop()

        print(f"[debug]: drew {drawn_card}")
        self.player.hand.add_card(drawn_card)
        
        self.end_turn()

    def check_scrap(self):
        print(self.scrap)

    def check_queen_prot(self):
        opponent = self.dealer if self.current_player == self.player else self.player
        queen_prot = False
        for c in opponent.effects:
            if c.rank is Rank.QUEEN:
                queen_prot = True
                break
        return queen_prot

    def resolve_point_card(self, card: Card, scuttle: bool, target: Card | None):
        """Resolve the effect of a point card."""
        if not card.can_be_point():
            print("Error: Card is not a point card.")
        if scuttle:
            opponent = self.dealer if self.current_player == self.player else self.player
            if target is not None and can_scuttle(card, target):
                if type(card.rank) is int:
                    opponent.cur_points -= card.rank
                    self.scrap.add_card(opponent.points.remove_card(card))
                else:
                    print("Error: Invalid card used for scuttling")
            else:
                print("Error: Card cannot scuttle target.")
        else:
            if type(card.rank) is int:
                self.current_player.cur_points += card.rank
            self.current_player.points.add_card(card)
            if self.current_player.cur_points >= self.current_player.win_con:
                self.end_game()
        self.end_turn()

    def resolve_effect_card(self, card: Card, target: Card, mode: int):
        """
        Resolve the effect of an one-off card.
        mode is only applicable for 2's and 7's.
        """
        if not card.can_be_one_off():
            print("Error: Card is not a one-off card.")
        else:
            opponent = self.dealer if self.current_player == self.player else self.player
            match card.rank:
                case Rank.ACE:
                    for player in [self.current_player, opponent]:
                        for c in player.points:
                            self.scrap.add_card(c)
                        player.points = Hand(set())
                        player.cur_points = 0
                case Rank.TWO:
                    if target is None:
                        print("Error: No target for card.")
                    if mode == 0:
                        if target.rank is not Rank.QUEEN and self.check_queen_prot():
                            print("Error: Queen protection active.")
                        else:
                            self.scrap.add_card(opponent.effects.remove_card(target))
                    if mode == 1:
                        if target.rank is not Rank.QUEEN and self.check_queen_prot():
                            print("Error: Queen protection active.")
                        else:
                            # todo: Block opponent's one-off
                            self.scrap.add_card(target)
                            pass
                case Rank.THREE:
                    if target is None:
                        print("Error: No target for card.")
                    self.current_player.hand.add_card(self.scrap.remove_card(target))
                case Rank.FOUR:
                    for i in range(2):
                        # Opponent chooses two cards to discard
                        self.scrap.add_card(opponent.hand.remove_card(card))
                        # Optional: Notify current player of discarded card
                    pass
                case Rank.FIVE:
                    for i in range(2):
                        self.draw_card()
                case Rank.SIX:
                    for p in [self.current_player, opponent]:
                        for c in p.effects:
                            self.scrap.add_card(c)
                        p.effects = Hand(set())
                        # todo: Handle Jack leaving board effects
                        # When 8s leave, set hand visibility to false
                        p.hand_visible = False
                        # When jacks leave, return all cards to owner's board
                        for c in p.points:
                            if c.jacks > 0:
                                if c.jacks % 2 == 1:
                                    controller = self.current_player if c in opponent.points else opponent
                                    controller.points.add_card(p.points.remove_card(c))
                                c.jacks = 0
                            # When kings leave, reset win condition
                            p.win_con = 0
                            self.scrap.add_card(p.points.remove_card(c))
                case Rank.SEVEN:
                    temp_hand = Hand(set())
                    temp_hand.add_card(self.deck.pop())
                    moves = self.generate_legal_moves(temp_hand, True)
                    if not moves:
                        self.scrap.add_card(temp_hand.cards.pop())
                    else:
                        # Ask user if card is played as point or one-off
                        if mode == 0:
                            # Ask user to designate target for scuttling
                            # target = user_input
                            self.resolve_point_card(temp_hand.cards.pop(), False, None)
                        if mode == 1:
                            # Ask user to designate target
                            # target = user_input
                            # self.resolve_effect_card(temp_hand.cards.pop(), None, 0)
                            pass
                case Rank.NINE:
                    # Return permanent effect card to hand
                    if target in self.current_player.effects:
                        self.current_player.hand.add_card(self.current_player.effects.remove_card(target))
                    elif target in opponent.effects:
                        opponent.hand.add_card(opponent.effects.remove_card(target))
                    else:
                        print("Error: Target not found in play.")
            if self.current_player.cur_points >= self.current_player.win_con:
                self.end_game()
        self.end_turn()


    def play_point_card(self, card: Card):
        """Play a point card from current player's hand."""
        self.consecutive_passes = 0
        
        if card not in self.current_player.hand:
            print("Error: Card not in hand.")

        # Remove card from player's hand
        self.current_player.hand.remove_card(card)

        self.priority = self.dealer if self.current_player == self.player else self.player
        self.resolve_point_card(card, False, None)
        
    def pass_turn(self):
        self.consecutive_passes += 1
        self.end_turn()

    def end_turn(self):
        """End your turn and give control to the other player."""
        if self.consecutive_passes >= 3:
            self.end_game()
        self.current_player = self.dealer if self.current_player == self.player else self.player
        self.priority = self.current_player

    def end_game(self):
        """Resolve the end of the game"""
        if self.consecutive_passes >= 3:
            print(f"{self.consecutive_passes} passes in a row. Game ends in draw")

        if self.player.cur_points >= self.player.win_con:
            print("Player 1 wins")
        
        if self.dealer.cur_points >= self.dealer.win_con:
            print("Player 2 wins")

        print("error inconclusive winner or draw but game ended.")
