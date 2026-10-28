
package com.evcharge.srms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "vehicle_number", nullable = false)
    private String vehicleNumber;

    @ManyToOne
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    @Column(name = "reservation_time", nullable = false)
    private LocalDateTime reservationTime;

    @Column(nullable = false)
    private String status;

    public Reservation() {}

    public Long getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getVehicleNumber() { return vehicleNumber; }
    public Station getStation() { return station; }
    public LocalDateTime getReservationTime() { return reservationTime; }
    public String getStatus() { return status; }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }
    public void setStation(Station station) { this.station = station; }
    public void setReservationTime(LocalDateTime reservationTime) {
        this.reservationTime = reservationTime;
    }
    public void setStatus(String status) { this.status = status; }
}
