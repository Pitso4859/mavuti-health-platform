package za.ac.vut.mavuti.service;

import za.ac.vut.mavuti.dto.AiDtos.AiChatRequest;
import za.ac.vut.mavuti.dto.AiDtos.AiChatResponse;

public interface AiHealthService {
    AiChatResponse chat(AiChatRequest request, String userId);
}
