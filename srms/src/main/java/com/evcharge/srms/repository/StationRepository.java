
package com.evcharge.srms.repository;

import com.evcharge.srms.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationRepository
        extends JpaRepository<Station, Long> {
}
