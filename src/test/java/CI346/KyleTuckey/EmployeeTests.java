package CI346.KyleTuckey;


import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.AnnotationConfigEmbeddedWebApplicationContext;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainer;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.mock.http.MockHttpOutputMessage;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.web.context.WebApplicationContext;
import org.thymeleaf.templateresolver.UrlTemplateResolver;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

/**
 * Created by Kyle Tuckey on 04/05/2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ReactRestApplication.class)
@WebAppConfiguration
public class EmployeeTests {

    private MockMvc mockMvc;

    private Employee Chris;
    private Employee Tom;
    private Employee Bill;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ShiftRepository shiftRepository;

    @Before
    public void setup() {
        this.mockMvc = webAppContextSetup(webApplicationContext).build();

        Chris = new Employee("Chris", "A singer");
        Tom = new Employee("Tom", "A Drummer");
        Bill = new Employee("Bill", "A Bass Player");

        this.employeeRepository.deleteAll();
        this.employeeRepository.save(Arrays.asList(Chris, Tom, Bill));
    }


    @Test
    public void checkEndPointExists() throws Exception {
        Long ChrisId = Chris.getId();
        this.mockMvc.perform(get("/api")
                .accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
    }

    @Test
    public void getEmployees() throws Exception {
        this.mockMvc.perform(get("/api/employees").accept(MediaType.parseMediaType("application/hal+json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/hal+json;charset=UTF-8"))
                .andExpect(jsonPath("_embedded.employees", hasSize(3)))
                .andExpect(jsonPath("_embedded.employees[0].name", is("Chris")))
                .andExpect(jsonPath("_embedded.employees[0].description", is("A singer")))
                .andExpect(jsonPath("_embedded.employees[1].name", is("Tom")))
                .andExpect(jsonPath("_embedded.employees[1].description", is("A Drummer")))
                .andExpect(jsonPath("_embedded.employees[2].name", is("Bill")))
                .andExpect(jsonPath("_embedded.employees[2].description", is("A Bass Player")));
    }

    @Test
    public void getChris() throws Exception {
        Long Id = Chris.getId();
        this.mockMvc.perform(get("/api/employees/" + Id).accept(MediaType.parseMediaType("application/hal+json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/hal+json;charset=UTF-8"))
                .andExpect(jsonPath("$.name", is("Chris")))
                .andExpect(jsonPath("$.description", is("A singer")));
    }

    @Test
    public void getBill() throws Exception {
        Long Id = Bill.getId();
        this.mockMvc.perform(get("/api/employees/" + Id).accept(MediaType.parseMediaType("application/hal+json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/hal+json;charset=UTF-8"))
                .andExpect(jsonPath("$.name", is("Bill")))
                .andExpect(jsonPath("$.description", is("A Bass Player")));
    }

    @Test
    public void getTom() throws Exception {
        Long Id = Tom.getId();
        this.mockMvc.perform(get("/api/employees/" + Id).accept(MediaType.parseMediaType("application/hal+json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/hal+json;charset=UTF-8"))
                .andExpect(jsonPath("$.name", is("Tom")))
                .andExpect(jsonPath("$.description", is("A Drummer")));
    }

    @Test
    public void createEmployee() throws Exception {
        this.mockMvc.perform(post("/api/employees")
                .contentType("application/json")
                .content("{\"name\":\"Eric\",\"description\":\"also known as Magneto\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    public void deleteEmployee() throws Exception {
        Long Id = Chris.getId();
        this.mockMvc.perform(delete("/api/employees/" + Id)
                .accept(MediaType.parseMediaType("application/hal+json;charset=UTF-8")))
                .andExpect(status().isNoContent());
    }

    @Test
    public void updateEmployee() throws Exception {
        Long Id = Chris.getId();
        this.mockMvc.perform(put("/api/employees/" + Id)
                .contentType("application/json")
                .content("{\"name\":\"Chris\",\"description\":\"No longer a singer\"}"))
                .andExpect(status().isNoContent());
    }

    @Test
    // I cannot seem to get the server port into this document, so it is hardcoded for this test
    // There is definitely a better way of doing this
    public void addShiftToChris() throws Exception {
        Long Id = Chris.getId();
        this.mockMvc.perform(post("/api/shifts")
                .contentType("application/json")
                .content("{\"name\":\"Night Shift\"," +
                        "\"date\":\"2017-05-19T00:00:00.000+0000\"," +
                        "\"time\":\"Evening\"," +
                        "\"employee\":\"http://localhost:8090/api/employees/"+Id+"\"}"))
                        .andExpect(status().isCreated());
    }

    protected String json(Object o) throws IOException {
        MockHttpOutputMessage mockHttpOutputMessage = new MockHttpOutputMessage();
        return mockHttpOutputMessage.getBodyAsString();
    }
}
