import React from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(45deg, #000000, #0a0a2e);
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 15px;
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  box-shadow: 0 0 20px rgba(0, 0, 255, 0.1);

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(100, 149, 237, 0.3);
  }

  /* Enhanced Blubs (Falling Stars) */
  .blub {
    height: calc(3px * var(--j));
    width: calc(1px * var(--j));
    background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(173, 216, 230, 1) 100%);
    box-shadow:
      0 0 20px rgba(255, 255, 255, 0.8),
      0 0 30px rgba(173, 216, 230, 0.6);
    animation: animated linear infinite reverse;
    animation-duration: calc(40s / var(--i));
    rotate: 25deg;
    opacity: 0.8;
    filter: blur(calc(0.5px * var(--j)));
  }

  @keyframes animated {
    0% {
      transform: translateY(250px) scale(0.3) rotate(25deg);
    }
    100% {
      transform: translateY(-40px) scale(1.2) rotate(25deg);
    }
  }

  .card:hover .blub {
    animation-duration: calc(30s / var(--i));
    opacity: 1;
  }
`

function NightCard() {
  return (
    <StyledWrapper>
      <div style={{ '--i': 10, '--j': 2 }} className="blub" />
      <div style={{ '--i': 12, '--j': 1.8 }} className="blub" />
      <div style={{ '--i': 16, '--j': 2.2 }} className="blub" />
      <div style={{ '--i': 9, '--j': 1.5 }} className="blub" />
      <div style={{ '--i': 7, '--j': 1.7 }} className="blub" />
      <div style={{ '--i': 18, '--j': 2.5 }} className="blub" />
      <div style={{ '--i': 20, '--j': 2 }} className="blub" />
      <div style={{ '--i': 16, '--j': 1.9 }} className="blub" />
      <div style={{ '--i': 21, '--j': 2.1 }} className="blub" />
      <div style={{ '--i': 5, '--j': 1.6 }} className="blub" />
    </StyledWrapper>
  )
}

export default NightCard
