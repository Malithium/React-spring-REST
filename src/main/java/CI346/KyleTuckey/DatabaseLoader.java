package CI346.KyleTuckey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by kt172 on 13/03/2017.
 */
@Component
public class DatabaseLoader implements CommandLineRunner {
    private final EmployeeRepository eRepository;
    private final ShiftRepository sRepository;

    @Autowired
    public DatabaseLoader(EmployeeRepository eRepository, ShiftRepository sRepository){
        this.eRepository = eRepository;
        this.sRepository = sRepository;
    }

    @Override
    public void run(String... strings) throws Exception {
        /*
        Employee frodo = new Employee("Frodo Baggins", "Ring Bearer");
        Set shiftsA = new HashSet<Shift>(){{
            add(new Shift(frodo, "Ring Duty", frodo.getName()));
            add(new Shift(frodo, "Gollum caretaker", frodo.getName()));
        }};
        frodo.setShifts(shiftsA);

        Employee bilbo = new Employee("Bilbo Baggins", "Thief");
        Set shiftsB = new HashSet<Shift>(){{
            add(new Shift(bilbo, "gold seeking", bilbo.getName()));
            add(new Shift(bilbo, "birthday", bilbo.getName()));
        }};
        bilbo.setShifts(shiftsB);

        this.eRepository.save(frodo);
        this.eRepository.save(bilbo);
        */
    }
}
