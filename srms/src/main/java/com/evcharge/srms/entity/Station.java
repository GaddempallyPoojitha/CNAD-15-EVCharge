
package com.evcharge.srms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stations")
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;

    @Column(name = "total_chargers")
    private int totalChargers;

    @Column(name = "available_chargers")
    private int availableChargers;

    @Column(name = "price_per_kwh")
    private double pricePerKwh;

    public Station() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getLocation() { return location; }
    public int getTotalChargers() { return totalChargers; }
    public int getAvailableChargers() { return availableChargers; }
    public double getPricePerKwh() { return pricePerKwh; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setLocation(String location) { this.location = location; }
    public void setTotalChargers(int totalChargers) {
        this.totalChargers = totalChargers;
    }
    public void setAvailableChargers(int availableChargers) {
        this.availableChargers = availableChargers;
    }
    public void setPricePerKwh(double pricePerKwh) {
        this.pricePerKwh = pricePerKwh;
    }
}
