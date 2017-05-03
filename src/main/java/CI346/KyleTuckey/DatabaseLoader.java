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
        Employee bilbo = new Employee("Bilbo Baggins", "Thief");
        this.eRepository.save(frodo);
        this.eRepository.save(bilbo);
        */
    }
}
