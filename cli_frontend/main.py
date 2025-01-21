from backend.game import Game


def main():
    game = Game()
    # game loop
    while True:
        inp = input("> ")
        if inp == "exit":
            break
        elif inp == "help" or inp == "h":
            print("Commands:")
            print("  [h]elp  -\tShow this help message")
            print("  [e]xit  -\tExit the game without saving")
            print("  [l]ist  -\tList all available moves")
            print("  [b]oard -\tPrint the current board")
            print("  [m]ove  -\tMake a move")
        elif inp == "exit" or inp == "e":
            print("goodbye!")
            break
        




if __name__ == '__main__':
    print("Welcome to Cuttle!\nType '[h]elp' for a list of commands.")
    main()
