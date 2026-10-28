
package com.evcharge.srms.repository;

import com.evcharge.srms.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    List<Reservation> findByCustomerNameIgnoreCase(String customerName);

    long countByStationIdAndStatus(Long stationId, String status);
}
