'''This program displays a simple greeting.'''
# test
def getSpecies():
    '''Get the user's species.'''

    options = ["human", "robot", "alian"]
    done = False

    while not done:
        answer = input("Are you a human[h], robot[r], alian[a]? ").lower()
        if answer == "h" or answer == "r" or answer == "a":
            if answer == "h":
                species = options[0]
            elif answer == "r":
                species = options[1]
            else:
                species = options[2]
            done = True
            
            return species
        else:
            print("Invalid input. Enter: [h], [r], [a]")

def dispGreeting(species):
    '''Display the custom hello world greeting.'''

    print(f"\nHello {species} world!\n")

def main():
    species = getSpecies()
    dispGreeting(species)

if __name__ == "__main__":
    main()