#include <iostream>
#include <fstream>
#include <string>

// Function declarations
void getTimes(int& startTime, int& endTime);
double calcHours(int startTime, int endTime);
void saveHours(double totalHours);
void displayHours(double totalHours);
void greet();

/*********************************
* MAIN FUNCTION:
* Execution starts here
*********************************/
int main()
{
    greet(); // Greet the user

    // Declare variables
    int startTime;
    int endTime;
    double totalHours;

    getTimes(startTime, endTime);
    totalHours = calcHours(startTime, endTime);
    saveHours(totalHours);
    displayHours(totalHours);

    return 0; // Indicate program success
}

/*********************************
* greeting:
* Greet the user
*********************************/
void greet() {
    std::string name; 
    std::cout << "[input name]" << std::endl;
    std::cin >> name;
    std::cout << " " << std::endl;
    std::cout << "Hello " << name << "!" << std::endl;
    std::cout << "Lets calculate your work hours" << std::endl;
    std::cout << " " << std::endl;
}

/*********************************
* GET TIMES:
* Prompt user for start and end 
* time.
*********************************/
void getTimes(int& startTime, int& endTime) {
    std::cout << "In 24 hour time EXAMPLE [0900]" << std::endl;
    std::cout << "Enter start time: ";
    std::cin >> startTime;
    std::cout << " " << std::endl;
    std::cout << "In 24 hour time EXAMPLE [1700]" << std::endl;
    std::cout << "Enter end time: ";
    std::cin >> endTime;
}

/*********************************
* CALCULATE HOURS:
* Parameters: startTime, endTime
* Calculate the total hours worked
* for the day.
* Return: totalHours
*********************************/
double calcHours(int startTime, int endTime) {
    // Caclulate the difference
    double hours = endTime - startTime;
    return (hours / 100);
}

/*********************************
* SAVE HOURS:
* Parameters: totalHours
* Save hours to CSV to named 
* weekly-hours.csv
*********************************/
void saveHours(double totalHours) {
    // Open CSV in append mode
    std::ofstream  file("weekly-hours.csv", std::ios::app);

    // Check if file is open
    if (file.is_open()) {
        //Write total hours to file
        file << "Total Hours: " << totalHours << "\n";
        // Close file
        file.close();
    }
    else {
        // Error message
        std::cerr << "No file found.";
    }
}

/*********************************
* DISPLAY HOURS:
* Parameters: totalHours
* Display the total hours to the 
* user.
*********************************/
void displayHours(double totalHours) {
    std::cout << "Total hours worked: " << totalHours << std::endl;
}