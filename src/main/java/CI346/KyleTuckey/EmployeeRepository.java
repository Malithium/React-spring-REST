package CI346.KyleTuckey;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Created by kt172 on 13/03/2017.
 */
public interface EmployeeRepository extends PagingAndSortingRepository<Employee, Long> {

}
