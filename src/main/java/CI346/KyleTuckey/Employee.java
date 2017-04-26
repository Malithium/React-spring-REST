package CI346.KyleTuckey;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

/**
 * Created by kt172 on 13/03/2017.
 */

@Entity
@Table(name = "employee")
public class Employee {

    private Long id;
    private String name;
    private String description;
    @Column(nullable = true)
    private Set<Shift> shifts;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long getId(){
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getName(){
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    public Set<Shift> getShifts(){
        return shifts;
    }

    public void setShifts(Set<Shift> shifts){
        this.shifts = shifts;
    }

    public String getDescription(){
        return description;
    }

    public void setDescription(String description){
        this.description = description;
    }

    private Employee() {}

    public Employee(String name, String description) {
        this.name = name;
        this.description = description;
    }

}
