package CI346.KyleTuckey;

import lombok.Data;

import javax.persistence.*;

/**
 * Created by Kyle Tuckey on 15/03/2017.
 */
@Data
@Entity
public class Shift {
    private Long id;
    private String name;
    private Employee employee;

    public Shift(){}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long getId(){
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    @ManyToOne
    @JoinColumn(name = "employee_id")
    public Employee getEmployee(){
        return employee;
    }

    public void setEmployee(Employee employee){
        this.employee = employee;
    }

    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public Shift(Employee employee, String name){
        this.employee = employee;
        this.name = name;
    }
}