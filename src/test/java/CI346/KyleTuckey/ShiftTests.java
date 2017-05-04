package CI346.KyleTuckey;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import java.util.Arrays;
import java.util.Date;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

/**
 * Created by Kyle Tuckey on 04/05/2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ReactRestApplication.class)
@WebAppConfiguration
public class ShiftTests {

    private MockMvc mockMvc;

    private Shift morning;
    private Shift afternoon;
    private Shift evening;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ShiftRepository shiftRepository;

    @Before
    public void setup() {
        this.mockMvc = webAppContextSetup(webApplicationContext).build();
        morning = new Shift("morning shift", new Date(), "Morning");
        afternoon = new Shift("afternoon shift", new Date(), "Afternoon");
        evening = new Shift("evening shift", new Date(), "Evening");

        this.shiftRepository.deleteAll();
        this.shiftRepository.save(Arrays.asList(morning, afternoon, evening));
    }


    @Test
    public void getShifts() throws Exception {
        this.mockMvc.perform(get("/api/shifts").accept(MediaType.parseMediaType("application/hal+json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/hal+json;charset=UTF-8"))
                .andExpect(jsonPath("_embedded.shifts", hasSize(3)))
                .andExpect(jsonPath("_embedded.shifts[0].name", is("morning shift")))
                .andExpect(jsonPath("_embedded.shifts[1].name", is("afternoon shift")))
                .andExpect(jsonPath("_embedded.shifts[2].name", is("evening shift")));
    }

    @Test
    public void getMorning() throws Exception {
        Long Id = morning.getId();
        this.mockMvc.perform(get("/api/shifts/" + Id).accept(MediaType.parseMediaType("application/hal+json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/hal+json;charset=UTF-8"))
                .andExpect(jsonPath("$.name", is("morning shift")));
    }

    @Test
    public void createShift() throws Exception {
        this.mockMvc.perform(post("/api/shifts")
                .contentType("application/json")
                .content("{\"name\":\"Other Shift\"," +
                        "\"date\":\"2017-05-19T00:00:00.000+0000\"," +
                        "\"time\":\"Evening\"}"))
                .andExpect(status().isCreated());
    }


    @Test
    public void deleteShift() throws Exception {
        Long Id = morning.getId();
        this.mockMvc.perform(delete("/api/shifts/" + Id)
                .accept(MediaType.parseMediaType("application/hal+json;charset=UTF-8")))
                .andExpect(status().isNoContent());
    }
}