interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
    };
    const ceo: Employee = {
    uniqueId: 1,
    name: "John Smith",
    subordinates: [1, 2, ....]
    };

    interface Employee {
        uniqueId: number;
        name: string;
        subordinates: Employee[];
        }
        interface IEmployeeOrgApp {
        ceo: Employee;
        /**
        * Moves the employee with employeeID (uniqueId) under a supervisor
        * (another employee) that has supervisorID (uniqueId).
        * E.g. Move Bob(employeeID) to be subordinate of
        * Georgina (supervisorID).
        * @param employeeID
        * @param supervisorID
        */
        move(employeeID: number, supervisorID: number): void;
        /** Undo last move action */
        undo(): void;
        /** Redo last undone action */
        redo(): void;
        }

class EmployeeOrgApp implements IEmployeeOrgApp {
    private history: Employee[][] = [];
    private currentIndex: number = -1;
  
    constructor(public ceo: Employee) {
      this.saveState();
    }
  
    move(employeeID: number, supervisorID: number): void {
      const employee = this.findEmployeeById(this.ceo, employeeID);
      const supervisor = this.findEmployeeById(this.ceo, supervisorID);
  
      if (employee && supervisor) {
        // Remove the employee from the current supervisor's subordinates list
        const currentSupervisor = this.findEmployeeSupervisor(this.ceo, employeeID);
        if (currentSupervisor) {
          currentSupervisor.subordinates = currentSupervisor.subordinates.filter(sub => sub.uniqueId !== employeeID);
        }
  
        // Add the employee to the new supervisor's subordinates list
        supervisor.subordinates.push(employee);
  
        this.saveState();
      }
    }
  
    undo(): void {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    }
  
    redo(): void {
      if (this.currentIndex < this.history.length - 1) {
        this.currentIndex++;
      }
    }
  
    private findEmployeeById(root: Employee, employeeID: number): Employee | undefined {
      if (root.uniqueId === employeeID) {
        return root;
      }
  
      for (const subordinate of root.subordinates) {
        const foundEmployee = this.findEmployeeById(subordinate, employeeID);
        if (foundEmployee) {
          return foundEmployee;
        }
      }
  
      return undefined;
    }
  
    private findEmployeeSupervisor(root: Employee, employeeID: number): Employee | undefined {
      for (const subordinate of root.subordinates) {
        if (subordinate.uniqueId === employeeID) {
          return root;
        }
  
        const foundSupervisor = this.findEmployeeSupervisor(subordinate, employeeID);
        if (foundSupervisor) {
          return foundSupervisor;
        }
      }
  
      return undefined;
    }
  
    private saveState(): void {
      this.history.splice(this.currentIndex + 1);

      const clonedState = this.cloneEmployeeHierarchy(this.ceo);
      this.history.push(clonedState);
      this.currentIndex = this.history.length - 1;
    }
  
    private cloneEmployeeHierarchy(root: Employee): Employee {
      return {
        uniqueId: root.uniqueId,
        name: root.name,
        subordinates: root.subordinates.map(this.cloneEmployeeHierarchy),
      };
    }
  }
  

  const app = new EmployeeOrgApp(ceo);


app.move(4, 15); // Bob Saget (ID: 4) becomes subordinate of Georgina Flangy (ID: 15)

app.undo(); // Undo the last move action

app.redo(); // Redo the last undone action