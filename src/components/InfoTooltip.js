// src/components/InfoTooltip.js
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/OrcamentoPage.css'; // usa seu css existente (ou crie um css específico)

const InfoTooltip = ({ children, content, initialPlacement = 'right' }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [placement, setPlacement] = useState(initialPlacement);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  // fecha ao clicar fora
  useEffect(() => {
    const onDown = (e) => {
      if (!visible) return;
      if (triggerRef.current?.contains(e.target)) return;
      if (tooltipRef.current?.contains(e.target)) return;
      setVisible(false);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('resize', () => setVisible(false));
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('resize', () => setVisible(false));
    };
  }, [visible]);

  useLayoutEffect(() => {
    if (!visible) return;
    const trig = triggerRef.current;
    const tip = tooltipRef.current;
    if (!trig || !tip) return;

    const rect = trig.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const gap = 8;
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    // checa onde cabe
    const fits = {
      right: rect.right + gap + tipRect.width <= window.innerWidth,
      left: rect.left - gap - tipRect.width >= 0,
      top: rect.top - gap - tipRect.height >= 0,
      bottom: rect.bottom + gap + tipRect.height <= window.innerHeight
    };

    let place = initialPlacement;
    if (place === 'right' && !fits.right) {
      if (fits.left) place = 'left';
      else if (fits.top) place = 'top';
      else if (fits.bottom) place = 'bottom';
    } else if (place === 'left' && !fits.left) {
      if (fits.right) place = 'right';
      else if (fits.top) place = 'top';
      else if (fits.bottom) place = 'bottom';
    } else if (place === 'top' && !fits.top) {
      if (fits.bottom) place = 'bottom';
      else if (fits.right) place = 'right';
      else if (fits.left) place = 'left';
    } else if (place === 'bottom' && !fits.bottom) {
      if (fits.top) place = 'top';
      else if (fits.right) place = 'right';
      else if (fits.left) place = 'left';
    }

    let left = 0, top = 0;
    if (place === 'right') {
      left = rect.right + gap + scrollX;
      top = rect.top + scrollY + (rect.height - tipRect.height) / 2;
    } else if (place === 'left') {
      left = rect.left - gap - tipRect.width + scrollX;
      top = rect.top + scrollY + (rect.height - tipRect.height) / 2;
    } else if (place === 'top') {
      left = rect.left + scrollX + (rect.width - tipRect.width) / 2;
      top = rect.top - gap - tipRect.height + scrollY;
    } else {
      left = rect.left + scrollX + (rect.width - tipRect.width) / 2;
      top = rect.bottom + gap + scrollY;
    }

    // evita sair do viewport
    left = Math.max(8 + scrollX, Math.min(left, window.innerWidth - tipRect.width - 8 + scrollX));
    top = Math.max(8 + scrollY, Math.min(top, window.innerHeight - tipRect.height - 8 + scrollY));

    setCoords({ left, top });
    setPlacement(place);
  }, [visible, initialPlacement]);

  const tooltipNode = visible
    ? ReactDOM.createPortal(
        <div
          ref={tooltipRef}
          className={`custom-tooltip custom-tooltip-${placement}`}
          style={{
            position: 'absolute',
            left: `${coords.left}px`,
            top: `${coords.top}px`,
            zIndex: 2000,
            maxWidth: 'calc(100vw - 20px)'
          }}
        >
          <div className="custom-tooltip-content">{content}</div>
        </div>,
        document.body
      )
    : null;

  // garante que o filho receba ref e clique
  const child = React.Children.only(children);
  const childProps = {
    ref: triggerRef,
    onClick: (e) => {
      if (child.props.onClick) child.props.onClick(e);
      setVisible((v) => !v);
    },
    style: { cursor: 'pointer', ...(child.props.style || {}) }
  };

  return (
    <>
      {React.cloneElement(child, childProps)}
      {tooltipNode}
    </>
  );
};

export default InfoTooltip;
