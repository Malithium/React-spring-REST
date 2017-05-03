package CI346.KyleTuckey;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Created by Kyle Tuckey on 15/03/2017.
 */
@Entity
@Data
public class Shift {

    @Column(name = "shift_id")
    private @Id @GeneratedValue Long id;
    private String name;


    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private @Version @JsonIgnore Long version;

    private Shift(){}

    public Shift(String name){
        this.name = name;
    }
}
