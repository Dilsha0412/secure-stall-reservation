package com.bookfair.service;

import com.bookfair.dto.StallDTO;
import com.bookfair.model.Stall;
import com.bookfair.repository.StallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StallService {
    
    @Autowired
    private StallRepository stallRepository;
    
    public List<StallDTO> getAllStalls() {
        return stallRepository.findAllByOrderByRowPositionAscColumnPositionAsc()
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    public List<StallDTO> getAvailableStalls() {
        return stallRepository.findByIsAvailableTrue()
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    private StallDTO mapToDTO(Stall stall) {
        return StallDTO.builder()
            .id(stall.getId())
            .stallCode(stall.getStallCode())
            .size(stall.getSize().name())
            .location(stall.getLocation())
            .price(stall.getPrice())
            .isAvailable(stall.getIsAvailable())
            .rowPosition(stall.getRowPosition())
            .columnPosition(stall.getColumnPosition())
            .build();
    }
    
    public void initializeStalls() {
        if (stallRepository.count() > 0) return;
        
        String[] zones = {"A", "B", "C", "D", "E"};
        int stallNum = 1;
        
        for (int row = 0; row < 5; row++) {
            for (int col = 0; col < 8; col++) {
                Stall.StallSize size;
                double price;
                
                if (row < 2) {
                    size = Stall.StallSize.SMALL;
                    price = 25000.0;
                } else if (row < 4) {
                    size = Stall.StallSize.MEDIUM;
                    price = 45000.0;
                } else {
                    size = Stall.StallSize.LARGE;
                    price = 75000.0;
                }
                
                Stall stall = Stall.builder()
                    .stallCode(zones[row] + (col + 1))
                    .size(size)
                    .location("Zone " + zones[row] + " - Position " + (col + 1))
                    .price(price)
                    .isAvailable(true)
                    .rowPosition(row)
                    .columnPosition(col)
                    .build();
                
                stallRepository.save(stall);
                stallNum++;
            }
        }
    }
}