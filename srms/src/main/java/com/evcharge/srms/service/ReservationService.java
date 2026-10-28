
package com.evcharge.srms.service;

import com.evcharge.srms.entity.Reservation;
import com.evcharge.srms.entity.Station;
import com.evcharge.srms.repository.ReservationRepository;
import com.evcharge.srms.repository.StationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    private final StationRepository stationRepository;
    private final ReservationRepository reservationRepository;

    public ReservationService(
            StationRepository stationRepository,
            ReservationRepository reservationRepository) {
        this.stationRepository = stationRepository;
        this.reservationRepository = reservationRepository;
    }

    public List<Station> getStations() {
        return stationRepository.findAll();
    }

    public List<Reservation> getReservations() {
        return reservationRepository.findAll();
    }

    public List<Reservation> getReservationsByCustomer(String name) {
        return reservationRepository.findByCustomerNameIgnoreCase(name);
    }

    public int getWaitTime(Long stationId) {
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() ->
                        new RuntimeException("Station not found"));

        long waiting = reservationRepository
                .countByStationIdAndStatus(stationId, "CONFIRMED");

        if (station.getAvailableChargers() > 0) {
            return (int) (waiting * 10);
        }

        return (int) ((waiting + 1) * 15);
    }

    @Transactional
    public Reservation createReservation(
            String customerName, String vehicleNumber, Long stationId) {

        Station station = stationRepository.findById(stationId)
                .orElseThrow(() ->
                        new RuntimeException("Station not found"));

        if (station.getAvailableChargers() <= 0) {
            throw new RuntimeException(
                    "No chargers available at this station");
        }

        station.setAvailableChargers(
                station.getAvailableChargers() - 1);
        stationRepository.save(station);

        Reservation reservation = new Reservation();
        reservation.setCustomerName(customerName);
        reservation.setVehicleNumber(vehicleNumber);
        reservation.setStation(station);
        reservation.setReservationTime(LocalDateTime.now());
        reservation.setStatus("CONFIRMED");

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() ->
                        new RuntimeException("Reservation not found"));

        if ("CONFIRMED".equals(reservation.getStatus())) {
            Station station = reservation.getStation();

            station.setAvailableChargers(Math.min(
                    station.getTotalChargers(),
                    station.getAvailableChargers() + 1));

            stationRepository.save(station);
            reservation.setStatus("CANCELLED");

            return reservationRepository.save(reservation);
        }

        throw new RuntimeException(
                "Reservation is already cancelled");
    }
}
