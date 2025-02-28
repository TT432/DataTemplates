'use client'

import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema } from '@rjsf/utils';
import { useState, useEffect } from 'react';
import './FormPage.css';
import JSONPretty from 'react-json-pretty';

const schema: RJSFSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "render controller",
  "type": "object",
  "properties": {
    "render_controllers": {
      "additionalProperties": {
        "type": "object",
        "properties": {
          "geometry": {
            "description": "用于设置模型的 molang",
            "type": "string"
          },
          "textures": {
            "description": "用于设置纹理的 molang 列表，结果会叠加成一个新的纹理",
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "arrays": {
            "type": "object",
            "description": "设定列表",
            "additionalProperties": {
              "type": "object",
              "additionalProperties": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          },
          "materials": {
            "description": "设置 material 的 molang 表，键是骨骼选择器，目前只有 \"*\" 是有效的，值是 material 的短名称（参见 client entity）",
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          }
        }
      }
    }
  }
};

import { UiSchema } from '@rjsf/utils';
import { IChangeEvent } from '@rjsf/core';

const uiSchema: UiSchema = {
  'ui:submitButtonOptions': {
    norender: true
  },
};
var JSONPrettyMon = require('react-json-pretty/dist/monikai');

import { Box, Button, Divider } from '@mui/material';

import client_entity_schema from "../../public/schemas/client_entity_schema.json"
import render_controllers_schema from "../../public/schemas/render_controllers_schema.json"

var SCHEMA_CONFIG = [
  client_entity_schema,
  render_controllers_schema
]

export default function MyApp() {
  const [formData, setFormData] = useState({});
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // 实时同步表单数据
  const handleChange = (event: IChangeEvent) => {
    // 通过 event.formData 获取数据
    setFormData(event.formData);
  };

  const [isCopied, setIsCopied] = useState(false);

  // 复制成功后自动重置状态
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
      setIsCopied(true);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };
  const [currentSchema, setCurrentSchema] = useState(0);
  const switchSchema = (index: number) => {
    setCurrentSchema(index);
    setFormData({});
  };
  return (
    <div className="form-container">
      <Box sx={{
        width: 200,
        p: 2,
        bgcolor: 'background.paper',
        borderRight: '1px solid #e0e0e0'
      }}>
        <Box sx={{ mb: 2, typography: 'h6' }}>
          模板列表
        </Box>
        <Divider />

        {SCHEMA_CONFIG.map((schema, index) => (
          <Button
            key={schema.title}
            fullWidth
            variant={currentSchema === index ? 'contained' : 'text'}
            onClick={() => switchSchema(index)}
            sx={{
              justifyContent: 'flex-start',
              my: 1,
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateX(5px)'
              }
            }}
          >
            {schema.title}
          </Button>
        ))}
      </Box>

      {/* 主表单区域 (保持 61.8% 宽度) */}
      <div className="main-form">
        <Form
          schema={SCHEMA_CONFIG[currentSchema]}
          formData={formData}
          uiSchema={uiSchema}
          onChange={handleChange}
          validator={validator}
          liveValidate
        />
      </div>

      <div className={`data-panel ${isPanelOpen ? 'open' : 'collapsed'}`}>
        <button
          className="panel-toggle"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
        >
          {isPanelOpen ? '▶ 收起' : '展开 ◀'}
        </button>

        {isPanelOpen && (
          <div className="panel-content">
            <div className="panel-header">
              <h3>实时表单数据</h3>
              <div className="panel-actions">
                <button
                  onClick={handleCopy}
                  className={`copy-btn ${isCopied ? 'copied' : ''}`}
                  disabled={isCopied}
                >
                  <span className="copy-content">
                    {isCopied ? (
                      '已复制'
                    ) : (
                      '复制 JSON'
                    )}
                  </span>
                </button>
              </div>
            </div>

            <div className="json-viewer">
              <JSONPretty
                data={formData}
                theme={JSONPrettyMon}
                style={{ padding: '1rem' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}