import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface QuickQuestion {
  title: string;
  prompt: string;
}

@Component({
  selector: 'app-ai-medical-assistant',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './ai-medical-assistant.html',
  styleUrl: './ai-medical-assistant.scss'
})
export class AiMedicalAssistantComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessagesContainer') chatMessagesElement!: ElementRef;

  messageForm: FormGroup;
  chatMessages: ChatMessage[] = [];
  isLoading = false;
  private shouldScrollToBottom = false;

  quickQuestions: QuickQuestion[] = [
    {
      title: "Drug Interactions with Warfarin",
      prompt: "What are the most important drug interactions with warfarin that pharmacists should monitor?"
    },
    {
      title: "Metformin Side Effects",
      prompt: "What are the common and serious side effects of metformin that patients should be aware of?"
    },
    {
      title: "Hypertension First-Line Therapy",
      prompt: "What are the current first-line medication options for treating hypertension according to guidelines?"
    },
    {
      title: "Antibiotic Stewardship",
      prompt: "What are key principles of antibiotic stewardship that clinical pharmacists should follow?"
    },
    {
      title: "Diabetes Medication Classes",
      prompt: "Compare the different classes of diabetes medications and their mechanisms of action."
    },
    {
      title: "Medication Reconciliation",
      prompt: "What are best practices for medication reconciliation in hospital settings?"
    }
  ];

  private apiUrl: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.messageForm = this.fb.group({
      message: [{value: '', disabled: false}, [Validators.required, Validators.minLength(3)]]
    });

    // Set API URL based on environment
    this.apiUrl = this.getApiUrl();
  }

  private getApiUrl(): string {
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

    if (isProduction) {
      return 'https://ai-gateway-production-0388.up.railway.app/api/v1/openai-proxy';
    } else {
      return '/api/v1/openai-proxy';
    }
  }

  private isProduction(): boolean {
    return window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  }

  ngOnInit() {
    // Component initialization
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  async sendMessage() {
    if (this.messageForm.invalid || this.isLoading) {
      return;
    }

    const userMessage = this.messageForm.get('message')?.value.trim();
    if (!userMessage) return;

    // Add user message
    this.addMessage('user', userMessage);
    this.messageForm.reset();
    this.isLoading = true;

    // Disable form while loading
    this.messageForm.get('message')?.disable();

    try {
      const response = await this.callAIAPI(userMessage);
      this.addMessage('ai', response);
    } catch (error) {
      console.error('Error calling AI API:', error);
      let errorMessage = 'I apologize, but I\'m experiencing technical difficulties. ';

      // Check if it's a CORS error
      if (error instanceof TypeError && error.message.includes('CORS')) {
        errorMessage += 'This appears to be a network connectivity issue. ';
      }

      errorMessage += 'Please try again later or consult with a healthcare professional for immediate assistance.';

      this.addMessage('ai', errorMessage);
    } finally {
      this.isLoading = false;
      // Re-enable form after loading
      this.messageForm.get('message')?.enable();
    }
  }

  async askQuickQuestion(question: QuickQuestion) {
    if (this.isLoading) return;

    this.addMessage('user', question.title);
    this.isLoading = true;

    // Disable form while loading
    this.messageForm.get('message')?.disable();

    try {
      const response = await this.callAIAPI(question.prompt);
      this.addMessage('ai', response);
    } catch (error) {
      console.error('Error calling AI API:', error);
      let errorMessage = 'I apologize, but I\'m experiencing technical difficulties. ';

      // Check if it's a CORS error
      if (error instanceof TypeError && error.message.includes('CORS')) {
        errorMessage += 'This appears to be a network connectivity issue. ';
      }

      errorMessage += 'Please try again later or consult with a healthcare professional for immediate assistance.';

      this.addMessage('ai', errorMessage);
    } finally {
      this.isLoading = false;
      // Re-enable form after loading
      this.messageForm.get('message')?.enable();
    }
  }

  private async callAIAPI(prompt: string): Promise<string> {
    const systemPrompt = `You are an AI medical assistant helping a registered pharmacist (RPh) with pharmaceutical and clinical questions.
Provide evidence-based, accurate information about medications, drug interactions, clinical pharmacy practices, and healthcare guidance.
Always remind users to consult healthcare professionals for specific medical decisions. Keep responses professional, informative, and well-structured.
Focus on scientific evidence, clinical data, and established medical practices. Maintain a professional, secular tone appropriate for healthcare settings.
Do not include religious references, spiritual content, or biblical quotes in your responses.`;

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 800
    };

    try {
      const response = await this.http.post<any>(this.apiUrl, requestBody, {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json'
        }
      }).toPromise();

      if (response?.choices?.[0]?.message?.content) {
        return response.choices[0].message.content;
      } else if (response?.data?.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      } else if (response?.response) {
        return response.response;
      } else if (response?.message) {
        return response.message;
      } else if (response?.data) {
        return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      } else {
        console.warn('Unexpected API response structure:', response);
        return 'I received your question but could not generate a proper response. Please try rephrasing your question.';
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  private addMessage(type: 'user' | 'ai', content: string) {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type,
      content: this.formatMessage(content),
      timestamp: new Date()
    };

    this.chatMessages.push(message);
    this.shouldScrollToBottom = true;
  }

  private formatMessage(content: string): string {
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const out: string[] = [];
    let listBuf: string[] = [];
    let paraBuf: string[] = [];

    const flushList = () => {
      if (listBuf.length) {
        out.push('<ul>' + listBuf.join('') + '</ul>');
        listBuf = [];
      }
    };
    const flushPara = () => {
      if (paraBuf.length) {
        out.push('<p>' + this.inline(paraBuf.join(' ')) + '</p>');
        paraBuf = [];
      }
    };
    const flushAll = () => { flushList(); flushPara(); };

    for (const raw of lines) {
      const line = raw.trimEnd();

      if (!line.trim()) {
        flushAll();
        continue;
      }

      // Horizontal rule
      if (/^-{3,}\s*$/.test(line)) {
        flushAll();
        out.push('<hr/>');
        continue;
      }

      // Heading (#, ##, ###, ...)
      const h = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
      if (h) {
        flushAll();
        const tag = 'h' + Math.min(6, h[1].length + 2);
        out.push(`<${tag}>${this.inline(h[2])}</${tag}>`);
        continue;
      }

      // List item ("- ..." or "* ...")
      const li = line.match(/^\s*[-*]\s+(.+)$/);
      if (li) {
        flushPara();
        listBuf.push(`<li>${this.inline(li[1])}</li>`);
        continue;
      }

      // Default: paragraph line (joined with the next non-list line)
      flushList();
      paraBuf.push(line);
    }

    flushAll();
    return out.join('');
  }

  private inline(text: string): string {
    // Escape HTML before applying markdown so AI output cannot inject tags.
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  private scrollToBottom() {
    if (this.chatMessagesElement) {
      const element = this.chatMessagesElement.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  trackByFn(index: number, item: ChatMessage): string {
    return item.id;
  }
}
