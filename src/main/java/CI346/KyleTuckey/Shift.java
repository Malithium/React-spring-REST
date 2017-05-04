package CI346.KyleTuckey;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;

/**
 * Created by Kyle Tuckey on 15/03/2017.
 */
@Entity
@Data
public class Shift {

    @Column(name = "shift_id")
    private @Id @GeneratedValue Long id;
    private String name;
    private Date date;
    private String time;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private @Version @JsonIgnore Long version;

    private Shift(){}

    public Long getId()
    {
        return this.id;
    }

    public Shift(String name, Date date, String time)
    {
        this.name = name;
        this.date = date;
        this.time = time;
    }
}
