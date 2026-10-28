
package com.evcharge.srms.controller;

import com.evcharge.srms.entity.Reservation;
import com.evcharge.srms.entity.Station;
import com.evcharge.srms.service.ReservationService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")

public class StationController {

    private final ReservationService service;

    public StationController(ReservationService service) {
        this.service = service;
    }

    @GetMapping("/stations")
    public List<Station> getStations() {
        return service.getStations();
    }

    @GetMapping("/stations/{id}/wait-time")
    public Map<String, Object> getWaitTime(@PathVariable Long id) {
        return Map.of(
                "stationId", id,
                "estimatedWaitMinutes", service.getWaitTime(id));
    }

    @GetMapping("/reservations")
    public List<Reservation> getReservations() {
        return service.getReservations();
    }

    @GetMapping("/reservations/customer/{name}")
    public List<Reservation> getCustomerReservations(
            @PathVariable String name) {
        return service.getReservationsByCustomer(name);
    }

    @PostMapping("/reservations")
    public Reservation createReservation(
            @Valid @RequestBody ReservationRequest request) {
        return service.createReservation(
                request.customerName(),
                request.vehicleNumber(),
                request.stationId());
    }

    @PutMapping("/reservations/{id}/cancel")
    public Reservation cancelReservation(@PathVariable Long id) {
        return service.cancelReservation(id);
    }

    public record ReservationRequest(
            @NotBlank String customerName,
            @NotBlank String vehicleNumber,
            @NotNull @Positive Long stationId) {
    }
}
