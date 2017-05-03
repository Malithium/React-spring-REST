package CI346.KyleTuckey;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Employee {

    @Column(name = "employee_id")
    private @Id @GeneratedValue Long id;
    private String name;
    private String description;


    @JsonIgnore
    @OneToMany(orphanRemoval = true, mappedBy = "employee", fetch = FetchType.EAGER)
    private List<Shift> shifts;

    private @Version @JsonIgnore Long version;

    private Employee(){}

    public Employee(String name, String description) {
        this.name = name;
        this.description = description;
    }
}
