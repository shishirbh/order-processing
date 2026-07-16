# Hosted Order Processing Knowledge Base

The shared language for the internal application through which employees consult and maintain DK Hardware's order-processing knowledge.

## Language

**Employee**:
A person within the company who has an individual account in the application.
_Avoid_: Customer, tenant, public user

**Account**:
An employee's individual identity in the application, assigned exactly one role.
_Avoid_: Shared login, workspace

**Administrator**:
An employee role trusted to manage accounts and the governed knowledge base, in addition to using standard employee capabilities.
_Avoid_: Operator, superuser

**Standard User**:
An employee role that can consult but not modify the governed knowledge base.
_Avoid_: Regular user, viewer

**Knowledge Document**:
A managed source of company knowledge that can support chat answers.
_Avoid_: File, attachment, source file

**Document Version**:
An immutable historical state of a Knowledge Document created by publishing a change or replacement.
_Avoid_: Backup, copy

**Active Version**:
The one published Document Version of a Knowledge Document that can support current chat answers.
_Avoid_: Latest file, current copy

**Archived Document**:
A Knowledge Document retained for history but excluded from current chat answers and standard browsing.
_Avoid_: Deleted document

**Conversation**:
A saved exchange between one Employee and the assistant, owned by that Employee.
_Avoid_: Session, thread, transcript

**Citation**:
A reference from a chat answer to the specific Active Version of a Knowledge Document that supports it.
_Avoid_: Source name, footnote

**Audit Event**:
A durable record that a security-sensitive or administrative action occurred, without serving as a copy of affected chat content.
_Avoid_: Activity feed, chat history
