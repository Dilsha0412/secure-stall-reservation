package com.bookfair.repository;

import com.bookfair.model.Stall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StallRepository extends JpaRepository<Stall, Long> {
    List<Stall> findByIsAvailableTrue();
    List<Stall> findAllByOrderByRowPositionAscColumnPositionAsc();
}